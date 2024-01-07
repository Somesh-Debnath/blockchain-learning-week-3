# Exercise 19: Debugging 
## Problem Statement: 
 Users are able to burn tokens even if tokens are locked. Your task:
1. Identify potential reasons for this bug.
2. Write a unit test in Hardhat that simulates this error.
3. Debug and fix the issue in the "AdvancedToken" contract.
4. Document the debugging steps and the solution you implemented.

## Code snippet:
```
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AdvancedToken is IERC20 {
...

    function lockTokens(address _user, uint256 _time) public onlyOwner {
        lockedUntil[_user] = block.timestamp + _time;
    }

    function burn(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Not enough tokens");        
        balances[msg.sender] -= _amount;
        totalSupply -= _amount;

        emit Transfer(msg.sender, address(0), _amount);
    }
...
}
```

## 1. Potential Reason:
**burn** function does not have a check for locked tokens. So, users can burn their locked tokens too.

## 2. Unit test:
```
it("Should not be able to burn tokens if tokens are locked", async function (){
    await advancedToken.connect(owner).mint(addrOwner, 100n * 10n ** 18n);
    await advancedToken.connect(owner).lockTokens(addrOwner, 12n * 10n ** 18n);
    await expect(advancedToken.connect(addrOwner).burn(16n * 10n ** 18n)).to.be.revertedWith("Tokens locked");
})
```

## 3. Debugging and Fixing bug:
**burn** function should have the check before executing any of the following code. 

Fixed **burn** function:

```
function burn(uint256 amount) external {
    require(_lockedUntil[msg.sender] <= block.timestamp, "Tokens locked");
    require(_balances[msg.sender] >= amount, "Insufficient balance to burn");

    _balances[msg.sender] -= amount;
    _totalSupply -= amount;

    emit Transfer(msg.sender, address(0), amount);
    emit TokensBurned(msg.sender, amount);
}
```

## 4. Debugging steps and solution:
### Debugging Steps:
- Identified the potential reason for the bug.
- Added a check for locked tokens in **burn** function.
- Simulate the modified **burn** function in unit test. Verifies locked tokens can't be burned.
- Noticed that there is no check for locked tokens in **burn** function. 

### Solution:
- Added check for locked tokens in **burn** function.
- Locked tokens can't be burned now. Verified by simulating the **burn** function in unit test.


