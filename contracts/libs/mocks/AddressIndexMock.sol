pragma solidity 0.5;

import "../AddressIndexLib.sol";

/**
 * @title AddressIndexLibMock
 * @author Igor Dulger
 * @dev Mock contract to test address index library. All docs are into origin library.
 */
contract AddressIndexLibMock {

    using AddressIndexLib for AddressIndexLib.Indexes;

    AddressIndexLib.Indexes private indexes;

    function add(address _index, uint _id) external {
        indexes.add(_index, _id);
    }

    function update(address _index, uint _id) external {
        indexes.update(_index, _id);
    }

    function remove(address _index) external {
        indexes.remove(_index);
    }

    function getId(address _index) external view returns (uint) {
        return indexes.getId(_index);
    }

    function getIndex(uint _id) external view returns (address) {
        return indexes.getIndex(_id);
    }
}
