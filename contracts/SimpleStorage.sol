// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract SimpleStorage {
    string storedData;

    // we will store the ipfs file hash on 'storedData'

    function set(string memory x) public {
        storedData = x;
    }

    function get() public view returns (string memory) {
        return storedData;
    }
}
