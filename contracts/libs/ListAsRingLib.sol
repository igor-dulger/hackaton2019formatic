pragma solidity 0.5;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title List of ids library
 * @author Ihor Borysyuk Igor Dulger
 * @dev This library implements two way list to store ids of entity.
 *      You can add/remove ids and "walk" in two directions
 */
library ListAsRingLib {

    using SafeMath for uint;

    struct ListData {
        mapping (bytes32 => uint) ring;
        uint count;
    }

    /**
    * @dev Checks if id is not Zero.
    * @param _id id of some entity.
    * //revert
    */
    modifier isNotZero(uint _id) {
        require(_id > 0, "Zero id is forbiden");
        _;
    }

    /**
    * @dev Checks if id exists into the list.
    * @param _id id of some entity.
    * //revert
    */
    modifier shouldExist(ListData storage self, uint _id) {
        require(exists(self, _id) || _id==0, "this id should exists in list");
        _;
    }

    /**
    * @dev Checks if id NOT exists into the list.
    * @param _id id of some entity.
    * //revert
    */
    modifier shouldNotExist(ListData storage self, uint _id) {
        require(!exists(self, _id) && _id!=0, "this id should NOT exists in list");
        _;
    }

    /**
    * @dev Add a new id into the end of the list.
    * @param _id id of some entity.
    * //revert
    */
    function add(ListData storage self, uint _id)
        internal
        isNotZero(_id)
        shouldNotExist(self, _id)
    {
        add_before(self, _id, 0);
    }

    /**
    * @dev Add a new id into list after a target.
    * @param _id id of some entity.
    * //revert
    */
    function add_after(ListData storage self, uint _id, uint _target)
        internal
        isNotZero(_id)
        shouldNotExist(self, _id)
        shouldExist(self, _target)
    {
        bytes32 targetNextKey = generateNextKey(_target);
        uint nextId = self.ring[targetNextKey];

        self.ring[generatePrevKey(nextId)] = _id;

        self.ring[generateNextKey(_id)] = nextId;
        self.ring[generateCurrKey(_id)] = _id;
        self.ring[generatePrevKey(_id)] = _target;

        self.ring[targetNextKey] = _id;

        self.count = self.count.add(1);
    }

    /**
    * @dev Add a new id into list before a target.
    * @param _id id of some entity.
    * //revert
    */
    function add_before(ListData storage self, uint _id, uint _target)
        internal
        isNotZero(_id)
        shouldNotExist(self, _id)
        shouldExist(self, _target)
    {
        bytes32 targetPrevKey = generatePrevKey(_target);
        uint prevId = self.ring[targetPrevKey];

        self.ring[generateNextKey(prevId)] = _id;

        self.ring[generateNextKey(_id)] = _target;
        self.ring[generatePrevKey(_id)] = prevId;
        self.ring[generateCurrKey(_id)] = _id;

        self.ring[targetPrevKey] = _id;

        self.count = self.count.add(1);
    }

    /**
    * @dev Move id after target id.
    * @param _id id of some entity.
    * @param _target id of some entity.
    * //revert
    */
    function move_after(ListData storage self, uint _id, uint _target)
        internal
        isNotZero(_id)
        shouldExist(self, _id)
        shouldExist(self, _target)
    {
        require(_id != _target, "id can't be equal target");
        remove(self, _id);
        add_after(self, _id, _target);
    }

    /**
    * @dev Add a new id into list after a target.
    * @param _id id of some entity.
    * @param _target id of some entity.
    * //revert
    */
    function move_before(ListData storage self, uint _id, uint _target)
        internal
        isNotZero(_id)
        shouldExist(self, _id)
        shouldExist(self, _target)
    {
        remove(self, _id);
        add_before(self, _id, _target);
    }

    /**
    * @dev Remove id from the list.
    * @param _id id of some entity.
    * //revert
    */
    function remove(ListData storage self, uint _id)
        internal
        isNotZero(_id)
        shouldExist(self, _id)
    {
        bytes32 prevIdKey = generatePrevKey(_id);
        bytes32 nextIdKey = generateNextKey(_id);
        bytes32 currIdKey = generateCurrKey(_id);

        uint prevId = self.ring[prevIdKey];
        uint nextId = self.ring[nextIdKey];
        self.ring[generateNextKey(prevId)] = nextId;
        self.ring[generatePrevKey(nextId)] = prevId;

        delete self.ring[prevIdKey];
        delete self.ring[nextIdKey];
        delete self.ring[currIdKey];
        self.count = self.count.sub(1);
    }

    /**
    * @dev Get next id from the list.
    * @param _id id of some entity, put 0 to get first one.
    * @return (uint id)
    * //revert
    */
    function getNextId(ListData storage self, uint _id)
        internal
        shouldExist(self, _id)
        view
        returns (uint)
    {
        return self.ring[generateNextKey(_id)];
    }

    /**
    * @dev Get prev id from the list.
    * @param _id id of some entity, put 0 to get last one.
    * @return (uint id)
    * //revert
    */
    function getPrevId(ListData storage self, uint _id)
        internal
        shouldExist(self, _id)
        view
        returns (uint)
    {
        return self.ring[generatePrevKey(_id)];
    }

    /**
    * @dev Build key to store "current" id in a dictionary.
    * @param _id id of some entity.
    * @return (bytes32 key)
    */
    function generateCurrKey(uint _id) internal pure returns (bytes32 key) {
        return keccak256(abi.encodePacked("curr", _id));
    }

    /**
    * @dev Build key to store "next" id in a dictionary.
    * @param _id id of some entity.
    * @return (bytes32 key)
    */
    function generateNextKey(uint _id) internal pure returns (bytes32 key) {
        return keccak256(abi.encodePacked("next", _id));
    }

    /**
    * @dev Build key to store "prev" id in a dictionary.
    * @param _id id of some entity.
    * @return (bytes32 key)
    */
    function generatePrevKey(uint _id) internal pure returns (bytes32 key) {
        return keccak256(abi.encodePacked("prev", _id));
    }

    /**
    * @dev Returns count of ids
    * @return (uint)
    */
    function itemsCount(ListData storage self) internal view returns (uint) {
        return self.count;
    }

    /**
    * @dev Check if id exist in a list
    * @param _id id of some entity.
    * @return (boolean key)
    */
    function exists(ListData storage self, uint _id)
        internal
        view
        returns(bool)
    {
        return self.ring[generateCurrKey(_id)] == _id && _id != 0;
    }

    /**
    * @dev Check if ids exist in a list
    * @param _ids id of some entity.
    * @return (boolean key)
    */
    function statuses(ListData storage self, uint[] memory _ids)
        internal
        view
        returns(bool[] memory)
    {
        uint len = _ids.length;
        require(len < 50, "Status array can't be more than 50");
        bool[] memory result = new bool[](len);
        for (uint i = 0; i < len; i++) {
            result[i] = self.ring[generateCurrKey(_ids[i])] != 0;
        }
        return result;
    }
}
