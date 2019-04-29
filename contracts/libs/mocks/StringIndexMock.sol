pragma solidity 0.5;

import "../StringIndexLib.sol";

/**
 * @title StringIndexLibMock
 * @author Igor Dulger
 * @dev Mock contract to test string index library. All docs are into origin library.
 */
contract StringIndexLibMock {

    using StringIndexLib for StringIndexLib.Indexes;

    StringIndexLib.Indexes private indexes;

    function add(string calldata _index, uint _id) external {
        indexes.add(_index, _id);
    }

    function update(string calldata _index, uint _id) external {
        indexes.update(_index, _id);
    }

    function remove(string calldata _index) external {
        indexes.remove(_index);
    }

    function getId(string calldata _index) external view returns (uint) {
        return indexes.getId(_index);
    }

    function getIndex(uint _id) external view returns (string memory) {
        return indexes.getIndex(_id);
    }
}
