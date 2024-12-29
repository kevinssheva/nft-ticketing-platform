// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TicketNFT is ERC721URIStorage {
    constructor() ERC721("TicketNFT", "TNFT") {}

    // structure of ticket
    struct Ticket {
        uint256 eventId;
        string eventName;
        uint256 dateEvent;
        string zone;
        string seat;
        address owner;
        address creator;
        uint priceSeat;
        uint priceGas;
    }

    // list of key => value of ticket
    mapping(uint256 => Ticket) public tokenIdToTicket;
    // array of list ticket
    uint256[] private tickets;
    // user limit buy/event
    mapping(address => mapping(uint256 => uint256)) public userLimit;

    mapping(bytes32 => bool) private seatOccupied;

    // Events
    event TicketMinted(
        uint256 indexed tokenId,
        uint256 indexed EventID,
        address creator
    );

    event TicketCreated(
        uint256 indexed tokenId,
        uint256 indexed eventId,
        string zone,
        string seat
    );

    // Function
    function mintTicket(
        uint256 ticketId,
        uint256 eventId,
        string memory eventName,
        uint256 dateEvent,
        string memory zone,
        string memory seat,
        uint256 priceSeat,
        uint256 priceGas,
        address sender
    ) private returns (uint256) {
        require(_ownerOf(ticketId) == address(0), "Ticket ID already exists");

        bytes32 seatHash = keccak256(abi.encodePacked(zone, seat, eventId));
        require(!seatOccupied[seatHash], "Seat already occupied");

        Ticket memory newTicket = Ticket(
            eventId,
            eventName,
            dateEvent,
            zone,
            seat,
            sender,
            sender,
            priceSeat,
            priceGas
        );

        tickets.push(ticketId);
        _safeMint(sender, ticketId);
        tokenIdToTicket[ticketId] = newTicket;
        seatOccupied[seatHash] = true;

        emit TicketMinted(ticketId, eventId, sender);
        return ticketId;
    }

    function createTicket(
        uint256 ticketId,
        uint256 eventId,
        string memory eventName,
        uint256[] memory dates,
        string memory zone,
        string memory seat,
        uint256 priceSeat,
        uint256 limit,
        address owner,
        bool isHold
    ) public payable returns (uint256) {
        // date 0 = date event, date 1 = date sell, date 2 = date buy
        uint256 gasCost = gasleft();
        // require(_date[1] <= _date[2], "This Ticket is not for sell yet");
        if (!isHold) {
            require(priceSeat == msg.value, "Incorrect payment amount");
            require(
                userLimit[msg.sender][eventId] + 1 <= limit,
                "Purchase limit exceeded"
            );

            userLimit[msg.sender][eventId] = userLimit[msg.sender][eventId] + 1;

            (bool success, ) = payable(owner).call{value: msg.value}("");
            require(success, "Payment failed");
        }
        uint256 newTicketId = mintTicket(
            ticketId,
            eventId,
            eventName,
            dates[0],
            zone,
            seat,
            priceSeat,
            gasCost,
            msg.sender
        );
        emit TicketCreated(newTicketId, eventId, zone, seat);
        return newTicketId;
    }

    function getTicket(uint256 tokenId) public view returns (Ticket memory) {
        require(_ownerOf(tokenId) != address(0), "Ticket does not exist");
        return tokenIdToTicket[tokenId];
    }

    function getTotalTickets() public view returns (uint256) {
        return tickets.length;
    }

    function isTicketValid(uint256 tokenId) public view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) return false;

        Ticket memory ticket = tokenIdToTicket[tokenId];
        bytes32 seatHash = keccak256(
            abi.encodePacked(ticket.zone, ticket.seat, ticket.eventId)
        );

        return seatOccupied[seatHash];
    }
}
