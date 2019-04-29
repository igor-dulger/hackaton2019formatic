pragma solidity 0.5;

import "./ListAsRingLib.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title EntityLib
 * @author Igor Dulger
 * @dev Handle entity data type (CRUD)
 */
library EntityLib {
    using SafeMath for uint;
    using ListAsRingLib for ListAsRingLib.ListData;

    struct Entity {
        uint id;
        string data;
        uint version;
    }

    struct Entities {
        uint maxId;
        mapping (uint => Entity) dictionary;
        ListAsRingLib.ListData list;
    }

    /**
    * @dev Check if a entity exists in the storage
    * @param self Reference to entity storage.
    * @param _id Produce id.
    */
    modifier inStorage(Entities storage self, uint _id) {
        require(_id != 0 && self.dictionary[_id].id == _id, "id doesn't exist");
        _;
    }

    /**
    * @dev Create a new entity.
    * @param self Reference to entity storage.
    * @param _data Entity name.
    * @return uint
    */
    function add(
        Entities storage self,
        string memory _data
    )
        internal
        returns (uint)
    {
        self.maxId = uint(self.maxId.add(1));

        self.dictionary[self.maxId] = Entity(
            self.maxId,
            _data,
            1
        );

        self.list.add(self.maxId);

        return self.maxId;
    }

    /**
    * @dev Create a new entity.
    * @param self Reference to entity storage.
    * @param _data Entity name.
    * //revert
    * @return uint
    */
    function update(
        Entities storage self,
        uint _id,
        string memory _data
    )
        internal
        inStorage(self, _id)
        returns (uint)
    {
        self.dictionary[_id].data = _data;
        self.dictionary[_id].version = self.dictionary[_id].version.add(1);
        return _id;
    }

    /**
    * @dev Delete entity
    * @param self Reference to entity storage.
    * @param _id entity id to delete.
    * //revert
    */
    function remove(Entities storage self, uint _id)
        internal
        inStorage(self, _id)
        returns (bool)
    {
        delete self.dictionary[_id];
        self.list.remove(_id);
        return true;
    }

    /**
    * @dev Get entity.
    * @param self Reference to entity storage.
    * @param _id entity id.
    * @return uint, string, string
    * //revert
    */
    function get(
        Entities storage self,
        uint _id
    )
        internal
        inStorage(self, _id)
        view
        returns (uint, string memory, uint)
    {
        return (
            self.dictionary[_id].id,
            self.dictionary[_id].data,
            self.dictionary[_id].version
        );
    }
}
