// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./TicketNFT.sol";
import "./DynamicPricingOracleClientInterface.sol";
import "./DynamicPricingOracle.sol";

contract TicketMarketplace is TicketNFT, DynamicPricingOracleClientInterface {
    // structure of product
    struct Product {
        uint256 ticketId;
        uint256 price;
        address owner;
    }

    struct BoughtProduct {
        uint price;
        uint gas;
    }

    mapping(uint256 => Product) public listProduct; // Mapping to keep track of listed tickets
    mapping(uint256 => uint256) public dynamicPrices; // Mapping to keep track of dynamic prices
    mapping(uint256 => bool) public priceUpdated; // Mapping to keep track of whether the price has been updated
    mapping(uint256 => bool) public hasBeenListed; // Mapping to prevent the same item being listed twice
    mapping(uint256 => address) public claimableByAccount; // Mapping to keep track of who listed the ticket
    mapping(uint256 => BoughtProduct[]) public chainBuy; // Mapping to keep track of the chain of buys
    mapping(uint256 => uint256) public _productID; // Mapping to keep track of the product ID

    DynamicPricingOracle public oracle;

    uint256[] public products; // list of product

    // Events
    event ProductAdded(
        uint256 indexed ticketId,
        uint price,
        address indexed seller
    );

    event SellCancelled(
        uint256 indexed ticketId,
        uint price,
        address indexed seller
    );

    event ProductBought(
        uint256 indexed ticketId,
        uint price,
        uint gas,
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
    function addProduct(
        uint256 _ticketId,
        uint256 _price
    ) public onlyTokenOwner(_ticketId) {
        require(
            !hasBeenListed[_ticketId],
            "The ticket can only be listed once"
        );
        // Send the token to the smart contract
        _transfer(msg.sender, address(this), _ticketId);

        claimableByAccount[_ticketId] = msg.sender;
        listProduct[_ticketId] = Product(_ticketId, _price, msg.sender);
        hasBeenListed[_ticketId] = true;
        products.push(_ticketId);
        _productID[_ticketId] = products.length - 1;

        emit ProductAdded(_ticketId, _price, msg.sender);
    }

    function cancelProduct(
        uint256 _ticketId
    ) public isCheck(_ticketId, 1) isCheck(_ticketId, 2) {
        // Send the token from the smart contract back to the one who listed it
        _transfer(address(this), msg.sender, _ticketId);

        emit SellCancelled(_ticketId, listProduct[_ticketId].price, msg.sender);

        delete claimableByAccount[_ticketId];
        cleanUp(_ticketId);
    }

    function requestDynamicPrice(uint256 _ticketId) public {
        require(
            listProduct[_ticketId].owner != msg.sender,
            "Product not listed"
        );
        oracle.requestDynamicPrice(_ticketId, address(this));
        emit DynamicPriceRequested(_ticketId);
    }

    function dynamicPricingCallback(
        uint256 ticketId,
        uint256 price
    ) external override {
        require(msg.sender == address(oracle), "Unauthorized oracle");
        dynamicPrices[ticketId] = price;
        priceUpdated[ticketId] = true;
    }

    function buyProduct(
        uint256 _ticketId
    ) public payable isCheck(_ticketId, 2) {
        uint256 _gas = gasleft();

        require(priceUpdated[_ticketId], "Dynamic price not updated yet");
        uint256 price = dynamicPrices[_ticketId];
        require(msg.value >= price, "Insufficient funds");

        // address seller = listProduct[_ticketId].owner;
        // sent to owner
        payable(tokenIdToTicket[_ticketId].owner).transfer(msg.value);

        //transfer the token from the smart contract back to the buyer
        _transfer(address(this), msg.sender, _ticketId);
        tokenIdToTicket[_ticketId].owner = msg.sender;

        // list chain of buy
        chainBuy[_ticketId].push(
            BoughtProduct(listProduct[_ticketId].price, _gas)
        );

        // clean up
        delete claimableByAccount[_ticketId];
        delete dynamicPrices[_ticketId];
        cleanUp(_ticketId);
        emit ProductBought(_ticketId, price, _gas, msg.sender);
    }

    function getProductPrice(uint256 _ticketId) public view returns (uint256) {
        return (listProduct[_ticketId].price);
    }

    function getProductPriceHistory(
        uint256 _ticketId
    ) public view returns (BoughtProduct[] memory) {
        return chainBuy[_ticketId];
    }

    function getListedProducts() public view returns (uint256[] memory) {
        return products;
    }

    function cleanUp(uint256 _key) private {
        delete listProduct[_key];
        delete hasBeenListed[_key];
        products[_productID[_key]] = products[products.length - 1];
        products.pop();
    }
}
