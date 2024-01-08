## High-Level Design (HLD) for Decentralized Banking Platform

### Smart Contracts:

1. **AdvancedToken Contract:**
Our contract from exercise 18.
   - **Functionality:**
     - Represents the new token minted upon depositing traditional ERC-20 tokens.
     - Implements standard ERC-20 functions.
   - **Interactions:**
     - Linked to TokenExchange for minting and burning of tokens.
     - Interfaces with the lending and borrowing contracts for user interactions.
   - **Probable Functions:**
     - `mint(address _recipient, uint256 _amount)`
     - `burn(address _holder, uint256 _amount)`

2. **TokenExchange Contract:**
   - **Functionality:**
     - Users deposit traditional ERC-20 tokens into this contract.
     - In return, users receive an equivalent amount of "AdvancedToken" in their wallet.
     - The exchange rate is determined by an oracle or market mechanism or set your own rate as for this exercise.
   - **Interactions:**
     - Connected to ERC-20 token contract for depositing and withdrawing tokens.
     - Communicates with the Oracle for current exchange rates.
   - **Probable Functions:**
     - `depositTokens(address _user, uint256 _amount)`
     - `withdrawTokens(address _user, uint256 _amount)`
     - `getExchangeRate() view returns (uint256)`


3. **LendingContract:**
   - **Functionality:**
     - Users can lend their "AdvancedToken" to earn interest in traditional ERC-20.
     - Implements lending terms and conditions.
   - **Interactions:**
     - Utilizes AdvancedToken for tracking user balances.
     - Communicates with an interest rate oracle or internal mechanism.
   - **Probable Functions:**
     - `lendTokens(address _lender, uint256 _amount)`
     - `withdrawLending(address _lender, uint256 _amount)`
     - `redeemInterest()`

4. **BorrowingContract:**
   - **Functionality:**
     - Users can borrow traditional ERC-20 token against their "AdvancedToken" holdings.
     - Implements borrowing terms and conditions, including collateral requirements.
   - **Interactions:**
     - Utilizes AdvancedToken for tracking user balances and collateral.
     - Communicates with an interest rate oracle or internal mechanism.
     - May interact with a liquidation contract in case of default.
   - **Probable Functions:**
     - `borrowTokens(address _borrower, uint256 _amount, uint256 _collateral)`
     - `repayLoan(address _borrower, uint256 _amount)`
     - `liquidate(address _borrower)`

5. **Oracle Contract:**
   - **Functionality:**
     - Provides real-time data, such as exchange rates and interest rates.
     - Oracles may be external or decentralized, depending on the system's design.
   - **Interactions:**
     - Accessed by TokenExchange, LendingContract, and BorrowingContract.
   - **Probable Functions:**
     - `getExchangeRate() view returns (uint256)`
     - `getInterestRate() view returns (uint256)`

#### Interaction Flow

1. Users deposit ERC-20 tokens into the token exchange which mints an equivalent amount of Advanced Token into the user's wallet.
2. Users can lend their Advanced Token to the lending smart contract and earn interest.
3. Users can borrow Advanced Token from the lending smart contract by depositing collateral.
4. LendingContract and BorrowingContract interact with the AdvancedToken contract for balance tracking.
5. LendingContract calculates and credits interest to lenders.
6. BorrowingContract enforces repayment terms and may trigger liquidation if necessary.
7. Collateral management ensures the platform's stability by liquidating borrowers who fail to repay their loans.
8. Oracle provides real-time data for exchange rates and interest rates.