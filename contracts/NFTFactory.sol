// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MantleNFT.sol";

contract NFTFactory {
    event CollectionCreated(address indexed creator, address indexed nftContract, string name, string symbol);
    
    mapping(address => address[]) public creatorCollections;

    function createCollection(
        string memory name,
        string memory symbol
    ) external returns (address) {
        MantleNFT nft = new MantleNFT(name, symbol);
        nft.transferOwnership(msg.sender);
        
        creatorCollections[msg.sender].push(address(nft));
        
        emit CollectionCreated(msg.sender, address(nft), name, symbol);
        return address(nft);
    }

    function getCreatorCollections(address creator) external view returns (address[] memory) {
        return creatorCollections[creator];
    }
} 