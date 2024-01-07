// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import "./Token.sol";

contract AdvancedToken is TokenContract{

    struct Lock{
        uint256 amount;
        uint256 lockTime;
        uint256 unlockTime;
    }

    mapping(address=>Lock[]) public lockedTime;

    event Locked(address indexed user, uint256 amount, uint256 lockTime, uint256 unlockTime);

    constructor()
        TokenContract(
            "AdvancedToken",
            "AT",
            18,
            100 * 10 ** 18,
            1000 * 10 ** 18
        ) {}

    //mint to a user
    function mintToUser(address to, uint256 amount) public onlyOwner{
        require((totalSupply + amount) <= maxSupply, "Maximum supply reached");
        // Add the minted tokens to the owner's balance and increase total supply
        balances[to] += amount;
        totalSupply += amount;
    }

    //burn tokens 
    function burn(uint256 amount) public override {
        require(balances[msg.sender] - noOfLockedTokens(msg.sender)>= amount, "Insufficient balance");
        // Subtract the burned tokens from the owner's balance and decrease total supply
        balances[msg.sender] -= amount;
        totalSupply -= amount;
    }

    //transfer tokens
    function transfer(address to, uint256 amount) public returns (bool success){
        require(balances[msg.sender] - noOfLockedTokens(msg.sender)>= amount, "Insufficient balance");
        require(to != address(0), "Invalid address");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }

    //lock tokens
    function lockTokens(address user, uint256 amount, uint256 lockTime) public onlyOwner{

        require(balances[user] - noOfLockedTokens(user)>= amount, "Insufficient balance");
        require(lockTime > 0, "Invalid lock time");
        require(user != address(0), "Invalid address");

        uint unlockTime = block.timestamp + lockTime;
        lockedTime[user].push(Lock(amount, block.timestamp, block.timestamp + lockTime));
        emit Locked(user, amount, block.timestamp, block.timestamp + lockTime);
    }

    //return no of tokens locked for a user
    function noOfLockedTokens(address user) public view returns(uint256){
        uint256 lockedTokens = 0;
        for(uint256 i = 0; i < lockedTime[user].length; i++){
            if(block.timestamp < lockedTime[user][i].unlockTime){
                lockedTokens += lockedTime[user][i].amount;
            }
        }
        return lockedTokens;
    }
}
