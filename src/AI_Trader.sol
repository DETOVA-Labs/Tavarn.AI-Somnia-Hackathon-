// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ------------------------------------------------------------------
//                         IMPORTS
// ------------------------------------------------------------------
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract AITrader {
    using SafeERC20 for IERC20;

    // ------------------------------------------------------------------
    //                         STATE VARIABLES
    // ------------------------------------------------------------------
    address public immutable OWNER;
    address public aiWallet;
    IERC20 public paymentToken; // SOMI Token

    // Inventory: item address => quantity (logical count)
    mapping(address => uint256) public inventory;

    // Prices: item address => price (in SOMI's smallest unit)
    mapping(address => uint256) public prices;

    // Blacklist: user address => true/false
    mapping(address => bool) public blacklist;

    // Price rate-limit: item => last update timestamp
    mapping(address => uint256) public lastPriceUpdate;

    // Safeguards for price updates
    uint256 public maxPriceChangeBps = 2_000;     // max 20% change per update
    uint256 public minUpdateInterval = 30;        // minimum 30 seconds between updates per item

    // ------------------------------------------------------------------
    //                         EVENTS & MODIFIERS
    // ------------------------------------------------------------------
    event ItemBought(address indexed buyer, address indexed item, uint256 qty, uint256 price);
    event ItemSold(address indexed seller, address indexed item, uint256 qty, uint256 price);
    event PriceUpdated(address indexed item, uint256 oldPrice, uint256 newPrice);
    event Blacklisted(address indexed user);
    event Unblacklisted(address indexed user);
    event PaymentTokenSet(address indexed token);
    event AIWalletSet(address indexed ai);
    event TokensWithdrawn(address indexed to, uint256 amount);
    event SafeguardsUpdated(uint256 maxPriceChangeBps, uint256 minUpdateInterval);

    modifier onlyOwner() {
        require(msg.sender == OWNER, "Not owner");
        _;
    }

    modifier onlyAI() {
        require(msg.sender == aiWallet, "Not AI wallet");
        _;
    }

    modifier notBlacklisted() {
        require(!blacklist[msg.sender], "Blacklisted");
        _;
    }

    // ------------------------------------------------------------------
    //                         CONSTRUCTOR
    // ------------------------------------------------------------------
    constructor(address _aiWallet) {
        OWNER = msg.sender;
        aiWallet = _aiWallet;
        emit AIWalletSet(_aiWallet);
    }

    // ------------------------------------------------------------------
    //                         OWNER FUNCTIONS
    // ------------------------------------------------------------------
    function setPaymentToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token");
        paymentToken = IERC20(token);
        emit PaymentTokenSet(token);
    }

    function setAIWallet(address _aiWallet) external onlyOwner {
        require(_aiWallet != address(0), "Invalid AI wallet");
        aiWallet = _aiWallet;
        emit AIWalletSet(_aiWallet);
    }

    function addToBlacklist(address user) external onlyOwner {
        blacklist[user] = true;
        emit Blacklisted(user);
    }

    function removeFromBlacklist(address user) external onlyOwner {
        blacklist[user] = false;
        emit Unblacklisted(user);
    }

    function setSafeguards(uint256 _maxPriceChangeBps, uint256 _minUpdateInterval) external onlyOwner {
        require(_maxPriceChangeBps <= 10_000, "Bps too high");
        maxPriceChangeBps = _maxPriceChangeBps;
        minUpdateInterval = _minUpdateInterval;
        emit SafeguardsUpdated(_maxPriceChangeBps, _minUpdateInterval);
    }

    // Logical inventory management 
    function depositItem(address item, uint256 qty, uint256 initialPrice) external onlyOwner {
        inventory[item] += qty;

        // Optional initial price set
        if (prices[item] == 0 && initialPrice > 0) {
            prices[item] = initialPrice;
            emit PriceUpdated(item, 0, initialPrice);
        }
    }

    function withdrawItem(address item, uint256 qty) external onlyOwner {
        require(inventory[item] >= qty, "Not enough inventory");
        inventory[item] -= qty;
    }

    // Owner can withdraw accumulated SOMI from sales
    function withdrawTokens(uint256 amount, address to) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(address(paymentToken) != address(0), "Payment token not set");
        paymentToken.safeTransfer(to, amount);
        emit TokensWithdrawn(to, amount);
    }

    // ------------------------------------------------------------------
    //                         TRADING FUNCTIONS
    // ------------------------------------------------------------------
    // Player buys item from NPC with SOMI (requires prior approve)
    function buyItem(address item, uint256 qty) external notBlacklisted {
        require(address(paymentToken) != address(0), "Payment token not set");
        require(prices[item] > 0, "Item price not set");
        require(inventory[item] >= qty, "Not enough stock");

        uint256 unitPrice = prices[item];
        uint256 totalCost = unitPrice * qty;

        // Pull SOMI from buyer
        paymentToken.safeTransferFrom(msg.sender, address(this), totalCost);

        // Reduce stock
        inventory[item] -= qty;

        emit ItemBought(msg.sender, item, qty, unitPrice);
    }

    // Player sells item to NPC; NPC pays SOMI
    function sellItem(address item, uint256 qty) external notBlacklisted {
        require(address(paymentToken) != address(0), "Payment token not set");
        require(prices[item] > 0, "Item price not set");

        uint256 unitPrice = prices[item];
        uint256 totalPayout = unitPrice * qty;

        // Increase stock
        inventory[item] += qty;

        // Pay seller in SOMI
        paymentToken.safeTransfer(msg.sender, totalPayout);

        emit ItemSold(msg.sender, item, qty, unitPrice);
    }

    // ------------------------------------------------------------------
    //                         AI PRICE UPDATE
    // ------------------------------------------------------------------
    function updatePrice(address item, uint256 newPrice) external onlyAI {
        require(newPrice > 0, "Invalid price");

        uint256 oldPrice = prices[item];

        // Allow first update if no prior update timestamp
        if (lastPriceUpdate[item] == 0) {
            prices[item] = newPrice;
            lastPriceUpdate[item] = block.timestamp;
            emit PriceUpdated(item, oldPrice, newPrice);
            return;
        }

        // Enforce interval
        require(block.timestamp >= lastPriceUpdate[item] + minUpdateInterval, "Update too soon");

        // Enforce max change
        uint256 delta = newPrice > oldPrice ? newPrice - oldPrice : oldPrice - newPrice;
        uint256 changeBps = (delta * 10_000) / oldPrice;
        require(changeBps <= maxPriceChangeBps, "Price change too large");

        prices[item] = newPrice;
        lastPriceUpdate[item] = block.timestamp;
        emit PriceUpdated(item, oldPrice, newPrice);
    }

    // ------------------------------------------------------------------
    //                         VIEW FUNCTIONS
    // ------------------------------------------------------------------
    function getPrice(address item) external view returns (uint256) {
        return prices[item];
    }

    function getInventory(address item) external view returns (uint256) {
        return inventory[item];
    }

    function isPriced(address item) external view returns (bool) {
        return prices[item] > 0;
    }
}