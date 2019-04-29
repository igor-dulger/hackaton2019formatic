pragma solidity 0.5;

import "../UintEnumerationLib.sol";

/**
 * @title ListMock
 * @author Ihor Borysyuk Igor Dulger
 * @dev Mock contract to test List library. All docs are into origin library.
 */
contract UintEnumerationLibMock {

    using UintEnumerationLib for UintEnumerationLib.ListData;

    UintEnumerationLib.ListData private list;

    event Debug(string text, uint id);

    function add(uint _id) external {
        list.add(_id);
    }

    function remove(uint _id) external {
        list.remove(_id);
    }

    function getNextId(uint _id) external
        view
        returns (uint) {
        return list.getNextId(_id);
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
