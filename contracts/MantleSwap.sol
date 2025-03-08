// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MantleSwap is ReentrancyGuard, Ownable {
    mapping(address => mapping(address => uint256)) public liquidityPools;
    mapping(address => uint256) public tokenReserves;

    event TokenSwap(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    event LiquidityAdded(
        address indexed token,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    function addLiquidity(address token, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        tokenReserves[token] += amount;
        emit LiquidityAdded(token, amount);
    }

    function calculateAmountOut(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) public view returns (uint256) {
        require(tokenReserves[tokenIn] > 0 && tokenReserves[tokenOut] > 0, "Insufficient liquidity");
        
        // Using constant product formula (x * y = k)
        uint256 reserveIn = tokenReserves[tokenIn];
        uint256 reserveOut = tokenReserves[tokenOut];
        
        // Calculate output amount: dy = (y * dx) / (x + dx)
        uint256 amountOut = (reserveOut * amountIn) / (reserveIn + amountIn);
        return amountOut;
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external nonReentrant returns (uint256) {
        require(tokenIn != address(0), "Invalid token in");
        require(tokenOut != address(0), "Invalid token out");
        require(amountIn > 0, "Amount must be greater than 0");
        require(tokenReserves[tokenIn] > 0 && tokenReserves[tokenOut] > 0, "Insufficient liquidity");

        // Transfer tokens from user to contract
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Calculate amount out using price formula
        uint256 amountOut = calculateAmountOut(tokenIn, tokenOut, amountIn);
        require(amountOut >= minAmountOut, "Insufficient output amount");

        // Update reserves
        tokenReserves[tokenIn] += amountIn;
        tokenReserves[tokenOut] -= amountOut;

        // Transfer tokens to user
        IERC20(tokenOut).transfer(msg.sender, amountOut);

        emit TokenSwap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
        return amountOut;
    }

    function getReserves(address token) external view returns (uint256) {
        return tokenReserves[token];
    }
}