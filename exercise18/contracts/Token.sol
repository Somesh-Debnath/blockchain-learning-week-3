// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract TokenContract {
    // Public state variables
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint8 decimal;
    address public owner;
    uint256 public maxSupply;

    mapping(address => uint256) public balances;

    // Constructor to initialize the token with initial parameters
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimal,
        uint256 initialSupply,
        uint256 _maxSupply

    ) {
        // Set token details
        name = _name;
        symbol = _symbol;
        decimal = _decimal;

        owner = msg.sender;

        maxSupply = _maxSupply;

        require(initialSupply <= maxSupply, "Maximum supply reached");

        totalSupply = initialSupply;

        balances[msg.sender] = totalSupply;
    }

    modifier onlyOwner() {
        // Only allow the owner to proceed
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Function to mint new tokens
    function mintToOwner(uint256 amount) public onlyOwner{
        require((totalSupply + amount) <= maxSupply, "Maximum supply reached");
        // Add the minted tokens to the owner's balance and increase total supply
        balances[msg.sender] += amount;
        totalSupply += amount;
    }

    // Function to burn tokens
    function burn(uint256 amount) public onlyOwner{
    
        require(balances[msg.sender] >= amount, "Insufficient balance");
        // Subtract the burned tokens from the owner's balance and decrease total supply
        balances[msg.sender] -= amount;
        totalSupply -= amount;
    }

    // transfer tokens
    function transfer(uint256 amount, address to) public {
        // Sender should have enough balance, and the receiver address should be valid
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid address");
        // Subtract the tokens from the sender and add to the receiver
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}