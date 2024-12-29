// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./TicketNFT.sol";
import "./DynamicPricingOracleClientInterface.sol";
import "./DynamicPricingOracle.sol";

contract TicketMarketplace is TicketNFT, DynamicPricingOracleClientInterface {
    // structure of product
    struct Product {
        uint256 ticketId;
        address owner;
    }

    mapping(uint256 => Product) public listProduct; // Mapping to keep track of listed tickets
    mapping(uint256 => uint256) public dynamicPrices; // Mapping to keep track of dynamic prices
    mapping(uint256 => bool) public priceUpdated; // Mapping to keep track of whether the price has been updated
    mapping(uint256 => bool) public hasBeenListed; // Mapping to prevent the same item being listed twice
    mapping(uint256 => address) public claimableByAccount; // Mapping to keep track of who listed the ticket
    mapping(uint256 => uint256) public productId; // Mapping to keep track of the product ID

    DynamicPricingOracle public oracle;

    uint256[] public products; // list of product

    // Events
    event ProductAdded(uint256 indexed ticketId, address indexed seller);

    event SellCancelled(uint256 indexed ticketId, address indexed seller);

    event ProductBought(
        uint256 indexed ticketId,
        uint price,
        address indexed buyer
    );

    event DynamicPriceRequested(uint256 indexed ticketId);

    // Constructor
    constructor(address _oracleAddress) {
        oracle = DynamicPricingOracle(_oracleAddress);
    }

    // Modifiers
    modifier onlyTokenOwner(uint256 ticketId) {
        require(
            msg.sender == ownerOf(ticketId),
            "Only the owner of the Ticket can call this function."
        );
        _;
    }

    modifier isCheck(uint256 ticketId, uint code) {
        // code 1: hold or cancel
        // code 2: buy
        if (code == 1) {
            require(
                msg.sender == claimableByAccount[ticketId],
                "Only the address that has listed the Ticket can hold or cancel the listing."
            );
        } else if (code == 2) {
            require(
                hasBeenListed[ticketId],
                "The ticket needs to be listed in order to be bought, hold or cancel."
            );
        }
        _;
    }

    // Functions
    function addProduct(uint256 ticketId) public onlyTokenOwner(ticketId) {
        require(!hasBeenListed[ticketId], "The ticket can only be listed once");

        // Send the token to the smart contract
        _transfer(msg.sender, address(this), ticketId);

        claimableByAccount[ticketId] = msg.sender;
        listProduct[ticketId] = Product(ticketId, msg.sender);
        hasBeenListed[ticketId] = true;
        products.push(ticketId);
        productId[ticketId] = products.length - 1;

        emit ProductAdded(ticketId, msg.sender);
    }

    function requestDynamicPrice(uint256 ticketId) public {
        require(
            listProduct[ticketId].owner != msg.sender,
            "Product not listed"
        );
        oracle.requestDynamicPrice(ticketId, address(this));
        emit DynamicPriceRequested(ticketId);
    }

    function dynamicPricingCallback(
        uint256 ticketId,
        uint256 price
    ) external override {
        require(msg.sender == address(oracle), "Unauthorized oracle");
        dynamicPrices[ticketId] = price;
        priceUpdated[ticketId] = true;
    }

    function buyProduct(uint256 ticketId) public payable isCheck(ticketId, 2) {
        require(priceUpdated[ticketId], "Dynamic price not updated yet");
        uint256 price = dynamicPrices[ticketId];
        require(msg.value >= price, "Insufficient funds");

        // address seller = listProduct[ticketId].owner;
        // sent to owner
        payable(tokenIdToTicket[ticketId].owner).transfer(msg.value);

        //transfer the token from the smart contract back to the buyer
        _transfer(address(this), msg.sender, ticketId);
        tokenIdToTicket[ticketId].owner = msg.sender;

        // clean up
        delete claimableByAccount[ticketId];
        delete dynamicPrices[ticketId];
        cleanUp(ticketId);
        emit ProductBought(ticketId, price, msg.sender);
    }

    function getListedProducts() public view returns (uint256[] memory) {
        return products;
    }

    function cleanUp(uint256 _key) private {
        delete listProduct[_key];
        delete hasBeenListed[_key];
        products[productId[_key]] = products[products.length - 1];
        products.pop();
    }
}
