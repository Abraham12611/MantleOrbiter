// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MantleSwap is ReentrancyGuard, Ownable {
    event TokenSwap(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor() Ownable(msg.sender) {}

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external nonReentrant returns (uint256) {
        require(tokenIn != address(0), "Invalid token in");
        require(tokenOut != address(0), "Invalid token out");
        require(amountIn > 0, "Amount must be greater than 0");

        // Transfer tokens from user to contract
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Calculate amount out (simplified for demo)
        uint256 amountOut = calculateAmountOut(tokenIn, tokenOut, amountIn);
        require(amountOut >= minAmountOut, "Insufficient output amount");

        // Transfer tokens to user
        IERC20(tokenOut).transfer(msg.sender, amountOut);

        emit TokenSwap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);

        return amountOut;
    }

    function calculateAmountOut(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) internal pure returns (uint256) {
        // Simplified calculation for demo
        // In a real implementation, this would use proper price calculations
        return amountIn;
    }
}