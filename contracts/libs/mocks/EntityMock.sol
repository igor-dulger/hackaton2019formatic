pragma solidity 0.5;

import "../EntityLib.sol";

/**
 * @title ListMock
 * @author Igor Dulger
 * @dev Mock contract to test List library. All docs are into origin library.
 */
contract EntityLibMock {

    using EntityLib for EntityLib.Entities;
    using ListAsRingLib for ListAsRingLib.ListData;

    EntityLib.Entities private list;

    function add(string calldata _data) external {
        list.add(_data);
    }

    function update(uint _id, string calldata _data) external {
        list.update(_id, _data);
    }

    function remove(uint _id) external {
        list.remove(_id);
    }

    function get(uint _id) external view returns (uint, string memory, uint) {
        return list.get(_id);
    }

    function itemsCount() external view returns (uint) {
        return list.list.itemsCount();
    }

    function exists(uint _id) external view returns(bool) {
        return list.list.exists(_id);
    }
}
