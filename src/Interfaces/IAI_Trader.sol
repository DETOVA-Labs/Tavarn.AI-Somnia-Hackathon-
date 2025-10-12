// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAITrader {
    function buyItem(address item, uint256 qty) external;
    function sellItem(address item, uint256 qty) external;
    function updatePrice(address item, uint256 newPrice) external;
    function getPrice(address item) external view returns (uint256);
    function getInventory(address item) external view returns (uint256);
    function isPriced(address item) external view returns (bool);
}