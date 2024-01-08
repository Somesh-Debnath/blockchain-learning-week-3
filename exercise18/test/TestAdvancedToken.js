/*- **Unit Testing:** Write tests to ensure:
    1. Tokens are minted correctly and reflected in the balance.
    2. Tokens cannot be minted beyond the maximum supply.
    3. Users can burn their tokens, reflecting the reduced total supply.
    4. Tokens can be locked and unlocked correctly.
    5. Locked tokens cannot be transferred.
*/

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AdvancedToken", function () {
  let advancedToken;
  let owner;
  let addr;

  it("Should deploy the contract", async function () {
    advancedToken = await hre.ethers.deployContract("AdvancedToken", [], {});
    await advancedToken.waitForDeployment();
    [owner, addr] = await hre.ethers.getSigners();
  });

  //Test Constructor
  it("Should deploy with correct initial values", async function () {
    // Check if contract is deployed with correct initial values
    expect(await advancedToken.name()).to.equal("AdvancedToken");
    expect(await advancedToken.symbol()).to.equal("AT");
    expect(await advancedToken.decimal()).to.equal(18);
    expect(await advancedToken.totalSupply()).to.equal(100n * (10n ** 18n));
    expect(await advancedToken.maxSupply()).to.equal(1000n * (10n ** 18n));
    expect(await advancedToken.balances(owner)).to.equal(100n * (10n ** 18n));
});

  //Test Minting
  it("Should mint tokens by owner", async function () {
     //initial balance and total supply
     const ownerBalance = await advancedToken.balances(owner);
      const userBalance = await advancedToken.balances(addr);
      const totalSupply = await advancedToken.totalSupply();

      const tokensToMintToOwner = 50n * (10n ** 18n);
      const tokensToMintToUser = 25n * (10n ** 18n);

      await advancedToken.mintToOwner(tokensToMintToOwner);
      await advancedToken.connect(owner).mintToUser(addr, tokensToMintToUser);

      // Check if balances and totalSupply are updated correctly
      expect(await advancedToken.totalSupply()).to.equal(totalSupply + tokensToMintToOwner + tokensToMintToUser);
      expect(await advancedToken.balances(owner)).to.equal(ownerBalance + tokensToMintToOwner);
      expect(await advancedToken.balances(addr)).to.equal(userBalance + tokensToMintToUser);
  });

  //Test Minting beyond max supply
  it("Should not mint tokens beyond max supply", async function () {
    const maxSupply = await advancedToken.maxSupply();
    const totalSupply = await advancedToken.totalSupply();
    const userBalance = await advancedToken.balances(addr);
    const ownerBalance = await advancedToken.balances(owner);
    // Amount to mint beyond maxSupply
    const tokensToMint = maxSupply - totalSupply + 1n;
    await expect(advancedToken.connect(owner).mintToOwner(tokensToMint)).to.be.revertedWith("Maximum supply reached");
    await expect(advancedToken.connect(owner).mintToUser(addr, tokensToMint)).to.be.revertedWith("Maximum supply reached");

    // Check if balances remain unchanged
    expect(await advancedToken.balances(addr)).to.equal(userBalance);
    expect(await advancedToken.balances(owner)).to.equal(ownerBalance);
  });
    
  //Test Burning
  it("Should burn tokens from user", async function () {
        const totalSupply = await advancedToken.totalSupply();
        const userBalance = await advancedToken.balances(addr);
        // Amount to burn
        const tokensToBurn = userBalance - 10n;

        // Burn tokens from user
        await advancedToken.connect(addr).burn(tokensToBurn);
        // Attempting to burn more than available tokens should be reverted
        await expect(advancedToken.connect(addr).burn(tokensToBurn + 2n)).to.be.revertedWith("Insufficient balance");

        // Check if balances and totalSupply are updated correctly
        expect(await advancedToken.balances(addr)).to.equal(userBalance - tokensToBurn);
        expect(await advancedToken.totalSupply()).to.equal(totalSupply - tokensToBurn);
  });

  // Test locking function
  it("Should lock tokens for a specified duration", async function () {
    // Initial user balance
    const userBalance = await advancedToken.balances(addr);
    // Tokens to lock and lock duration
    const tokendToLock = userBalance - 1n;
    const lockDuration = 10000;

    // Lock tokens for a specified duration
    await advancedToken.connect(owner).lockTokens(lockDuration, tokendToLock, addr);
    // Attempting to burn more than locked tokens should be reverted
    await expect(advancedToken.connect(addr).burn(userBalance - tokendToLock + 1n)).to.be.revertedWith("Insufficient balance");

    // Check the locked balance after some time (3600 seconds)
    await network.provider.send("evm_increaseTime", [lockDuration]);
    await network.provider.send("evm_mine");
    await advancedToken.connect(addr).burn(userBalance - tokendToLock + 1n);
  });

  // Test token transfer function
  it("Should transfer tokens between addresses", async function () {
    // Initial user and owner balances
    const userBalance = await advancedToken.balances(addr);
    const ownerBalance = await advancedToken.balances(owner);
    // Tokens to transfer
    const tokensToTransfer = 10n;

    // Transfer tokens from owner to user
    await advancedToken.connect(owner).transfer(tokensToTransfer, addr);

    // Check if balances are updated correctly
    expect(await advancedToken.balances(owner)).to.equal(ownerBalance - tokensToTransfer);
    expect(await advancedToken.balances(addr)).to.equal(userBalance + tokensToTransfer);

    // Transfer tokens back from user to owner
    await advancedToken.connect(addr).transfer(tokensToTransfer, owner);

    // Check if balances are updated correctly
    expect(await advancedToken.balances(addr)).to.equal(userBalance);
    expect(await advancedToken.balances(owner)).to.equal(ownerBalance);
  });
});
