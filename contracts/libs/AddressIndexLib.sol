pragma solidity 0.5;

/**
 * @title AddressIndexLib
 * @author Igor Dulger
 * @dev Handle index
 */
library AddressIndexLib {

    struct Indexes {
        mapping (address => uint) direct_index;
        mapping (uint => address) revert_index;
    }

    /**
    * @dev Check if a index is free
    * @param self Reference to storage.
    * @param _index index.
    */
    modifier indexIsAvailable(Indexes storage self, address _index) {
        require(getId(self, _index) == 0, "This index is already used");
        _;
    }

    /**
    * @dev Check if an id is free
    * @param self Reference to storage.
    * @param _id id.
    */
    modifier idIsAvailable(Indexes storage self, uint _id) {
        require(self.revert_index[_id] == address(0x0), "This id is already used");
        _;
    }

    /**
    * @dev Check if an index is not empty.
    * @param _index index.
    */
    modifier notEmptyIndex(address _index) {
        require(_index != address(0x0), "index can't be empty");
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
    function getId(Indexes storage self, address _index)
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
        returns (address)
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
        address _index,
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
        address _index,
        uint _id
    )
        internal
        notEmptyIndex(_index)
        indexIsAvailable(self, _index)
    {
        address oldIndex = getIndex(self, _id);
        require(oldIndex != address(0x0), "Id must exists");
        delete self.direct_index[oldIndex];
        self.direct_index[_index] = _id;
        self.revert_index[_id] = _index;
    }

    /**
    * @dev Delete index
    * @param self Reference to storage.
    * @param _index to delete.
    */
    function remove(Indexes storage self, address _index)
        internal
    {
        uint id = getId(self, _index);
        require(id != 0, "Index must exists");

        delete self.direct_index[_index];
        delete self.revert_index[id];
    }
}
