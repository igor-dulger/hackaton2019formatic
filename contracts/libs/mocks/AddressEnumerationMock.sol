pragma solidity 0.5;

import "../AddressEnumerationLib.sol";

/**
 * @title ListMock
 * @author Ihor Borysyuk Igor Dulger
 * @dev Mock contract to test List library. All docs are into origin library.
 */
contract AddressEnumerationLibMock {

    using AddressEnumerationLib for AddressEnumerationLib.ListData;

    AddressEnumerationLib.ListData private list;

    event Debug(string text, uint id);

    function add(address _id) external {
        list.add(_id);
    }

    function remove(address _id) external {
        list.remove(_id);
    }

    function getNextId(address _id) external
        view
        returns (address) {
        return list.getNextId(_id);
    }

    function itemsCount() external view returns (uint) {
        return list.itemsCount();
    }

    function exists(address _id) external view returns (bool) {
        return list.exists(_id);
    }

    function statuses(address[] calldata _ids) external view returns (bool[] memory) {
        return list.statuses(_ids);
    }
}
