pragma solidity 0.5;

import "../ListAsRingLib.sol";

/**
 * @title ListMock
 * @author Ihor Borysyuk Igor Dulger
 * @dev Mock contract to test List library. All docs are into origin library.
 */
contract ListAsRingLibMock {

    using ListAsRingLib for ListAsRingLib.ListData;

    ListAsRingLib.ListData private list;

    function add(uint _id) external {
        list.add(_id);
    }

    function add_before(uint _id, uint _target) external {
        list.add_before(_id, _target);
    }

    function add_after(uint _id, uint _target) external {
        list.add_after(_id, _target);
    }

    function move_before(uint _id, uint _target) external {
        list.move_before(_id, _target);
    }

    function move_after(uint _id, uint _target) external {
        list.move_after(_id, _target);
    }

    function remove(uint _id) external {
        list.remove(_id);
    }

    function getNextId(uint _id) external view returns (uint) {
        return list.getNextId(_id);
    }

    function getPrevId(uint _id) external view returns (uint) {
        return list.getPrevId(_id);
    }

    function itemsCount() external view returns (uint) {
        return list.itemsCount();
    }

    function exists(uint _id) external view returns (bool) {
        return list.exists(_id);
    }

    function statuses(uint[] calldata _ids) external view returns (bool[] memory) {
        return list.statuses(_ids);
    }
}
