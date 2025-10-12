// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AI_Trader.sol";

// Simple ERC20 mock compatible with SafeERC20
contract MockERC20 {
    string public name = "Mock SOMI";
    string public symbol = "MSOMI";
    uint8 public decimals = 18;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "insufficient");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= amount, "allowance");
        require(balanceOf[from] >= amount, "balance");
        // decrease allowance first to match real ERC20 patterns
        allowance[from][msg.sender] = allowed - amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
}

contract AITraderTest is Test {
    AITrader trader;
    MockERC20 somi;

    // test actors
    address owner;
    address ai;
    address user1;
    address user2;

    // sample item addresses (logical items, not NFTs in this demo)
    address itemA = address(0xA11CE);
    address itemB = address(0xB0B);
    uint256 UNIT = 1e18;

    function setUp() public {
        owner = makeAddr("owner");
        ai = makeAddr("ai");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // label for nicer traces
        vm.label(owner, "Owner");
        vm.label(ai, "AI");
        vm.label(user1, "User1");
        vm.label(user2, "User2");

        // deploy contracts from owner
        vm.startPrank(owner);
        trader = new AITrader(ai);
        somi = new MockERC20();

        // set payment token
        trader.setPaymentToken(address(somi));

        // seed balances
        somi.mint(user1, 1_000_000 * UNIT);
        somi.mint(user2, 1_000_000 * UNIT);
        somi.mint(address(trader), 500_000 * UNIT); // fund trader for payouts

        // deposit inventory and initial price
        trader.depositItem(itemA, 100, 10 * UNIT); // 100 units at 10 SOMI
        trader.depositItem(itemB, 50, 5 * UNIT);   // 50 units at 5 SOMI

        vm.stopPrank();
    }

    // -------- Owner & Config tests --------

    function testSetPaymentToken() public {
        vm.startPrank(owner);
        MockERC20 newToken = new MockERC20();
        trader.setPaymentToken(address(newToken));
        vm.stopPrank();

        // validate via call
        assertEq(address(trader.paymentToken()), address(newToken), "payment token not set");
    }

    function testSetAIWallet() public {
        address newAI = makeAddr("newAI");
        vm.startPrank(owner);
        trader.setAIWallet(newAI);
        vm.stopPrank();

        assertEq(trader.aiWallet(), newAI, "ai wallet not updated");
    }

    function testAddAndRemoveBlacklist() public {
        vm.startPrank(owner);
        trader.addToBlacklist(user1);
        assertTrue(trader.blacklist(user1), "user1 should be blacklisted");
        trader.removeFromBlacklist(user1);
        vm.stopPrank();

        assertFalse(trader.blacklist(user1), "user1 should be unblacklisted");
    }

    function testSetSafeguards() public {
        vm.startPrank(owner);
        trader.setSafeguards(1000, 60); // 10% change, 60s
        vm.stopPrank();

        assertEq(trader.maxPriceChangeBps(), 1000, "max bps mismatch");
        assertEq(trader.minUpdateInterval(), 60, "min interval mismatch");
    }

    // -------- Trading tests: buyItem --------

    function testBuyItemReducesInventoryAndTransfersTokens() public {
        // user1 approves trader to spend SOMI
        vm.startPrank(user1);
        somi.approve(address(trader), type(uint256).max);

        uint256 price = trader.getPrice(itemA); // 10 SOMI
        uint256 qty = 3;
        uint256 totalCost = price * qty;

        uint256 balBefore = somi.balanceOf(user1);
        uint256 invBefore = trader.getInventory(itemA);

        trader.buyItem(itemA, qty);

        uint256 balAfter = somi.balanceOf(user1);
        uint256 invAfter = trader.getInventory(itemA);
        vm.stopPrank();

        assertEq(invAfter, invBefore - qty, "inventory should decrease");
        assertEq(balAfter, balBefore - totalCost, "user1 SOMI should decrease");
        assertEq(somi.balanceOf(address(trader)), 500_000 * UNIT + totalCost, "trader SOMI should increase");
    }

    function testBuyItemRevertsIfUnpriced() public {
        vm.startPrank(owner);
        trader.depositItem(itemB, 10, 0); // do not set price (already 5 SOMI, let's zero another item)
        vm.stopPrank();

        address itemUnpriced = address(0xDEAD);

        vm.startPrank(owner);
        trader.depositItem(itemUnpriced, 5, 0);
        vm.stopPrank();

        vm.startPrank(user1);
        somi.approve(address(trader), type(uint256).max);
        vm.expectRevert(bytes("Item price not set"));
        trader.buyItem(itemUnpriced, 1);
        vm.stopPrank();
    }

    function testBuyItemRevertsIfNotEnoughStock() public {
        vm.startPrank(user1);
        somi.approve(address(trader), type(uint256).max);
        vm.expectRevert(bytes("Not enough stock"));
        trader.buyItem(itemA, 1000);
        vm.stopPrank();
    }

    function testBuyItemBlockedWhenBlacklisted() public {
        vm.startPrank(owner);
        trader.addToBlacklist(user1);
        vm.stopPrank();

        vm.startPrank(user1);
        somi.approve(address(trader), type(uint256).max);
        vm.expectRevert(bytes("Blacklisted"));
        trader.buyItem(itemA, 1);
        vm.stopPrank();
    }

    // -------- Trading tests: sellItem --------

    function testSellItemIncreasesInventoryAndPaysSeller() public {
        // user2 sells 2 units of itemB at 5 SOMI each
        vm.startPrank(user2);
        uint256 price = trader.getPrice(itemB);
        uint256 qty = 2;
        uint256 payout = price * qty;

        uint256 balBefore = somi.balanceOf(user2);
        uint256 invBefore = trader.getInventory(itemB);

        trader.sellItem(itemB, qty);

        uint256 balAfter = somi.balanceOf(user2);
        uint256 invAfter = trader.getInventory(itemB);
        vm.stopPrank();

        assertEq(invAfter, invBefore + qty, "inventory should increase");
        assertEq(balAfter, balBefore + payout, "user2 should receive SOMI payout");
        assertEq(somi.balanceOf(address(trader)), 500_000 * UNIT - payout, "trader SOMI should decrease");
    }

    function testSellItemBlockedWhenBlacklisted() public {
        vm.startPrank(owner);
        trader.addToBlacklist(user2);
        vm.stopPrank();

        vm.startPrank(user2);
        vm.expectRevert(bytes("Blacklisted"));
        trader.sellItem(itemB, 1);
        vm.stopPrank();
    }

    function testSellItemRevertsIfUnpriced() public {
        address itemUnpriced = address(0xFEED);
        vm.startPrank(owner);
        trader.depositItem(itemUnpriced, 1, 0);
        vm.stopPrank();

        vm.startPrank(user1);
        vm.expectRevert(bytes("Item price not set"));
        trader.sellItem(itemUnpriced, 1);
        vm.stopPrank();
    }

    // -------- AI price update & safeguards --------

    function testAIUpdatePriceFirstTimeAllowed() public {
        vm.startPrank(ai);
        trader.updatePrice(itemA, 12 * UNIT);
        vm.stopPrank();

        assertEq(trader.getPrice(itemA), 12 * UNIT, "price should update");
    }

    function testAIUpdatePriceOnlyAI() public {
        vm.startPrank(user1);
        vm.expectRevert(bytes("Not AI wallet"));
        trader.updatePrice(itemA, 15 * UNIT);
        vm.stopPrank();
    }

    function testAIUpdatePriceRespectsIntervalAndMaxChange() public {
        // Set initial price
        vm.startPrank(ai);
        trader.updatePrice(itemB, 10 * UNIT); // first-time set overrides 5 to 10
        vm.stopPrank();

        // Try update too soon
        vm.prank(ai);
        vm.expectRevert(bytes("Update too soon"));
        trader.updatePrice(itemB, 11 * UNIT);

        // Warp time beyond interval
        uint256 interval = trader.minUpdateInterval();
        vm.warp(block.timestamp + interval + 1);

        // Try update beyond max change (20% default -> here we set to 50% to fail)
        // delta = |15 - 10| = 5; changeBps = 5/10 * 10000 = 5000 (50%)
        vm.prank(ai);
        vm.expectRevert(bytes("Price change too large"));
        trader.updatePrice(itemB, 15 * UNIT);

        // Valid update within 20%: 12 is 20% increase from 10
        vm.prank(ai);
        trader.updatePrice(itemB, 12 * UNIT);

        assertEq(trader.getPrice(itemB), 12 * UNIT, "price should be 12");
    }

    function testOwnerCanAdjustSafeguardsThenAIUpdates() public {
        // Owner relaxes safeguards to allow bigger/faster changes
        vm.startPrank(owner);
        trader.setSafeguards(8000, 1); // allow up to 80%, 1 second interval
        vm.stopPrank();

        // First set
        vm.startPrank(ai);
        trader.updatePrice(itemA, 20 * UNIT);
        vm.stopPrank();

        vm.warp(block.timestamp + 2);

        // 80% change from 20 -> 36 (delta 16, changeBps = 16/20 * 10000 = 8000)
        vm.startPrank(ai);
        trader.updatePrice(itemA, 36 * UNIT);
        vm.stopPrank();

        assertEq(trader.getPrice(itemA), 36 * UNIT, "price should update under relaxed safeguards");
    }

    // -------- Withdraw tokens --------

    function testOwnerWithdrawTokens() public {
        uint256 traderBalBefore = somi.balanceOf(address(trader));
        uint256 ownerBalBefore = somi.balanceOf(owner);

        vm.startPrank(owner);
        trader.withdrawTokens(1000 * UNIT, owner);
        vm.stopPrank();

        uint256 traderBalAfter = somi.balanceOf(address(trader));
        uint256 ownerBalAfter = somi.balanceOf(owner);

        assertEq(traderBalAfter, traderBalBefore - 1000 * UNIT, "trader balance should decrease");
        assertEq(ownerBalAfter, ownerBalBefore + 1000 * UNIT, "owner should receive tokens");
    }

    function testWithdrawTokensRevertsForNonOwner() public {
        vm.startPrank(user1);
        vm.expectRevert(bytes("Not owner"));
        trader.withdrawTokens(1 * UNIT, user1);
        vm.stopPrank();
    }

    // -------- Edge cases --------

    function testBuyItemRequiresApproval() public {
        // No approval set
        vm.startPrank(user1);
        // Our MockERC20 reverts with "allowance" if insufficient allowance
        vm.expectRevert(bytes("allowance"));
        trader.buyItem(itemA, 1);
        vm.stopPrank();
    }

    function testUpdatePriceRejectsZero() public {
        vm.startPrank(ai);
        vm.expectRevert(bytes("Invalid price"));
        trader.updatePrice(itemA, 0);
        vm.stopPrank();
    }
}