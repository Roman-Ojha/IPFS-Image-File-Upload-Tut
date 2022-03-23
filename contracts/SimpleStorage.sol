// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract SimpleStorage {
    string ipfsHash;

    // we will store the ipfs file hash on 'storedData'

    function set(string memory _ipfsHash) public {
        ipfsHash = _ipfsHash;
    }

    function get() public view returns (string memory) {
        return ipfsHash;
    }
}
