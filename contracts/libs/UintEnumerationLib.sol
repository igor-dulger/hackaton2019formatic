pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title List of ids library
 * @author Igor Dulger
 * @dev This library implements list to store ids of entity.
 *      You can add/remove ids and check if id/ids exist, get next id
 */
library UintEnumerationLib {

    using SafeMath for uint;

    struct ListData {
        mapping (uint => uint) indexes;
        uint[] ids;
    }

    /**
    * @dev Checks if id is not Zero.
    * @param _id id of some entity.
    * //revert
    */
    modifier isNotZero(uint _id) {
        require(_id > 0, "Zero id is forbidden");
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
        self.indexes[_id] = self.ids.length;
        self.ids.push(_id);
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
        uint lastIndex = self.ids.length-1;
        uint deletedIndex = self.indexes[_id];

        if (lastIndex != deletedIndex) {
            uint lastId = self.ids[lastIndex];

            self.ids[deletedIndex] = lastId;
            self.indexes[lastId] = deletedIndex;
        }

        delete self.indexes[_id];
        self.ids.length = self.ids.length.sub(1);
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
        uint index = self.indexes[_id];
        if (index.add(2) > self.ids.length) {
            return 0;
        } else {
            return (_id == 0) ? self.ids[0] : self.ids[index.add(1)];
        }
    }

    /**
    * @dev Returns count of ids
    * @return (uint)
    */
    function itemsCount(ListData storage self) internal view returns (uint) {
        return self.ids.length;
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
        if (self.ids.length > 0) {
            return self.ids[self.indexes[_id]] == _id && _id != 0;
        } else {
            return false;
        }
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
        require(_ids.length < 50, "Status array can't be more than 50");

        bool[] memory result = new bool[](_ids.length);
        for (uint i = 0; i < _ids.length; i++) {
            result[i] = exists(self, _ids[i]);
        }
        return result;
    }
}
