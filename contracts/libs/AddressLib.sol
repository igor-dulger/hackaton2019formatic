pragma solidity 0.5;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title List of ids library
 * @author Ihor Borysyuk Igor Dulger
 * @dev This library implemets two way list to store ids of entity.
 *      You can add/remove ids and "walk" in two directions
 */
library AddressLib {

    /**
    * @dev converts address to string
    * @param self input address.
    */
    function addressToString(address self) internal pure returns(string memory) {
        bytes32 value = bytes32(uint256(self));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}
