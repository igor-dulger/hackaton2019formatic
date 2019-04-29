pragma solidity 0.5;

/**
 * @title AddressIndexLib
 * @author Igor Dulger
 * @dev Handle index
 */
library StringIndexLib {

    struct Indexes {
        mapping (string => uint) direct_index;
        mapping (uint => string) revert_index;
    }

    /**
    * @dev Check if a index is free
    * @param self Reference to storage.
    * @param _index index.
    */
    modifier indexIsAvailable(Indexes storage self, string memory _index) {
        require(getId(self, _index) == 0, "This index is already used");
        _;
    }

    /**
    * @dev Check if an id is free
    * @param self Reference to storage.
    * @param _id id.
    */
    modifier idIsAvailable(Indexes storage self, uint _id) {
        bytes memory stringIndex = bytes(self.revert_index[_id]);
        require(stringIndex.length == 0, "This id is already used");
        _;
    }

    /**
    * @dev Check if an index is not empty.
    * @param _index index.
    */
    modifier notEmptyIndex(string memory _index) {
        bytes memory stringIndex = bytes(_index);
        require(stringIndex.length != 0, "index can't be empty");
        _;
    }

    /**
    * @dev Check if an index is not empty.
    * @param _id index.
    */
    modifier notEmptyId(uint _id) {
        require(_id != 0, "id can't be empty");
        _;
    }

    /**
    * @dev Get id by index.
    * @param self Reference to storage.
    * @param _index index.
    */
    function getId(Indexes storage self, string memory _index)
        internal
        view
        returns (uint)
    {
        return self.direct_index[_index];
    }

    /**
    * @dev Get index by id.
    * @param self Reference to storage.
    * @param _id id.
    */
    function getIndex(Indexes storage self, uint _id)
        internal
        view
        returns (string memory)
    {
        return self.revert_index[_id];
    }

    /**
    * @dev Create a new index.
    * @param self Reference to storage.
    * @param _index index.
    * @param _id id.
    */
    function add(
        Indexes storage self,
        string memory _index,
        uint _id
    )
        internal
        notEmptyIndex(_index)
        notEmptyId(_id)
        indexIsAvailable(self, _index)
        idIsAvailable(self, _id)
    {
        self.direct_index[_index] = _id;
        self.revert_index[_id] = _index;
    }

    /**
    * @dev Update index.
    * @param self Reference to storage.
    * @param _index index.
    * @param _id id.
    */
    function update(
        Indexes storage self,
        string memory _index,
        uint _id
    )
        internal
        notEmptyIndex(_index)
        indexIsAvailable(self, _index)
    {
        string memory oldIndex = getIndex(self, _id);
        bytes memory bytesIndex = bytes(oldIndex);
        require(bytesIndex.length != 0, "Id must exists");
        delete self.direct_index[oldIndex];
        self.direct_index[_index] = _id;
        self.revert_index[_id] = _index;
    }

    /**
    * @dev Delete index
    * @param self Reference to storage.
    * @param _index to delete.
    */
    function remove(Indexes storage self, string memory _index)
        internal
    {
        uint id = getId(self, _index);
        require(id != 0, "Index must exists");

        delete self.direct_index[_index];
        delete self.revert_index[id];
    }
}
