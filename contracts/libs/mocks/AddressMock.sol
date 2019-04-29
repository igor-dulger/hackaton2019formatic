pragma solidity 0.5;

import "../AddressLib.sol";

/**
 * @title AddressLibMock
 * @author Igor Dulger
 * @dev Mock contract to test Address library. All docs are into origin library.
 */
contract AddressLibMock {

    using AddressLib for address;
    using AddressLib for address payable;

    function addressToString(address _code) external pure returns(string memory) {
        return _code.addressToString();
    }
}
