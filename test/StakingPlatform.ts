import { expect } from "chai";
import { Contract, Signer, toNano, WalletTypes, zeroAddress, Address, getRandomNonce } from "locklift";
import { FactorySource } from "../build/factorySource";
import BigNumber from "bignumber.js";
import { EverscaleStandaloneClient } from "everscale-standalone-client";

let walletAccount: any;
let ownerAccount: any;
let stakingPlatform: Contract<FactorySource["StakingPlatform"]>;
let stakerWallet: Contract<FactorySource["StakerWallet"]>;
let tokenWallet: Contract<FactorySource["TokenWallet"]>;
const tokenWalletAbi = {
  ABIversion: 2,
  version: "2.2",
  header: ["pubkey", "time", "expire"],
  functions: [
    { name: "constructor", inputs: [], outputs: [] },
    {
      name: "supportsInterface",
      inputs: [
        { name: "answerId", type: "uint32" },
        { name: "interfaceID", type: "uint32" },
      ],
      outputs: [{ name: "value0", type: "bool" }],
    },
    { name: "destroy", inputs: [{ name: "remainingGasTo", type: "address" }], outputs: [] },
    {
      name: "burnByRoot",
      inputs: [
        { name: "amount", type: "uint128" },
        { name: "remainingGasTo", type: "address" },
        { name: "callbackTo", type: "address" },
        { name: "payload", type: "cell" },
      ],
      outputs: [],
    },
    {
      name: "burn",
      inputs: [
        { name: "amount", type: "uint128" },
        { name: "remainingGasTo", type: "address" },
        { name: "callbackTo", type: "address" },
        { name: "payload", type: "cell" },
      ],
      outputs: [],
    },
    { name: "balance", inputs: [{ name: "answerId", type: "uint32" }], outputs: [{ name: "value0", type: "uint128" }] },
    { name: "owner", inputs: [{ name: "answerId", type: "uint32" }], outputs: [{ name: "value0", type: "address" }] },
    { name: "root", inputs: [{ name: "answerId", type: "uint32" }], outputs: [{ name: "value0", type: "address" }] },
    { name: "walletCode", inputs: [{ name: "answerId", type: "uint32" }], outputs: [{ name: "value0", type: "cell" }] },
    {
      name: "transfer",
      inputs: [
        { name: "amount", type: "uint128" },
        { name: "recipient", type: "address" },
        { name: "deployWalletValue", type: "uint128" },
        { name: "remainingGasTo", type: "address" },
        { name: "notify", type: "bool" },
        { name: "payload", type: "cell" },
      ],
      outputs: [],
    },
    {
      name: "transferToWallet",
      inputs: [
        { name: "amount", type: "uint128" },
        { name: "recipientTokenWallet", type: "address" },
        { name: "remainingGasTo", type: "address" },
        { name: "notify", type: "bool" },
        { name: "payload", type: "cell" },
      ],
      outputs: [],
    },
    {
      name: "acceptTransfer",
      id: "0x67A0B95F",
      inputs: [
        { name: "amount", type: "uint128" },
        { name: "sender", type: "address" },
        { name: "remainingGasTo", type: "address" },
        { name: "notify", type: "bool" },
        { name: "payload", type: "cell" },
      ],
      outputs: [],
    },
    {
      name: "acceptMint",
      id: "0x4384F298",
      inputs: [
        { name: "amount", type: "uint128" },
        { name: "remainingGasTo", type: "address" },
        { name: "notify", type: "bool" },
        { name: "payload", type: "cell" },
      ],
      outputs: [],
    },
    { name: "sendSurplusGas", inputs: [{ name: "to", type: "address" }], outputs: [] },
  ],
  data: [
    { key: 1, name: "root_", type: "address" },
    { key: 2, name: "owner_", type: "address" },
  ],
  events: [],
  fields: [
    { name: "_pubkey", type: "uint256" },
    { name: "_timestamp", type: "uint64" },
    { name: "_constructorFlag", type: "bool" },
    { name: "root_", type: "address" },
    { name: "owner_", type: "address" },
    { name: "balance_", type: "uint128" },
  ],
} as const;
let signer: Signer;

describe("Test Sample contract", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;

    const { account: accountAddOperation } = await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.WalletV3,
      value: toNano(10000),
      publicKey: signer.publicKey,
    });
    ownerAccount = accountAddOperation;
    const { account: walletAccountAddOperation } = await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.WalletV3,
      value: toNano(10000),
      publicKey: (await locklift.keystore.getSigner("1"))!.publicKey,
    });
    walletAccount = walletAccountAddOperation;
  });

  describe("Contracts", async function () {
    it("Load contract factory", async function () {
      const platformData = await locklift.factory.getContractArtifacts("StakingPlatform");
      const stakerData = await locklift.factory.getContractArtifacts("StakerWallet");

      expect(platformData.code).not.to.equal(undefined, "Code should be available");
      expect(platformData.abi).not.to.equal(undefined, "ABI should be available");
      expect(platformData.tvc).not.to.equal(undefined, "tvc should be available");

      expect(stakerData.code).not.to.equal(undefined, "Code should be available");
      expect(stakerData.abi).not.to.equal(undefined, "ABI should be available");
      expect(stakerData.tvc).not.to.equal(undefined, "tvc should be available");
    });

    it("Deploy Staking contract", async function () {
      // Address of initial token supply recipient (write your own)
      const initialSupplyTo = new Address(`0:${signer.publicKey}`);
      // Address of token owner (write your own)
      const rootOwner = new Address(`0:${signer.publicKey}`);
      // Name of the token
      const name = "Stake Test Token";
      // Symbol of the token
      const symbol = "STT";
      // How many token will be issued instantly after deploy
      const initialSupply = 1000000;
      // The number of decimals the token uses
      const decimals = 18;
      // If true, disables token minting
      const disableMint = false;
      // If true, disables token burning by root
      const disableBurnByRoot = false;
      // If true, pauses token burning
      const pauseBurn = false;

      const TokenWallet = locklift.factory.getContractArtifacts("TokenWallet");

      const { contract: tokenRoot } = await locklift.factory.deployContract({
        contract: "TokenRoot",
        publicKey: signer.publicKey,
        initParams: {
          // this field should be zero address if deploying with public key (see source code)
          deployer_: zeroAddress,
          randomNonce_: getRandomNonce(),
          rootOwner_: ownerAccount.address,
          name_: name,
          symbol_: symbol,
          decimals_: decimals,
          walletCode_: TokenWallet.code,
        },
        constructorParams: {
          initialSupplyTo: ownerAccount.address,
          initialSupply: new BigNumber(initialSupply).shiftedBy(decimals).toFixed(),
          deployWalletValue: toNano(2),
          mintDisabled: disableMint,
          burnByRootDisabled: disableBurnByRoot,
          burnPaused: pauseBurn,
          remainingGasTo: ownerAccount.address,
        },
        value: toNano(5),
      });

      // const tokenWalletAddress = (await tokenRoot.methods
      //   .walletOf({ answerId: 0, walletOwner: ownerAccount.address } as never)
      //   .call()) as any;
      const tokenWalletAddress = (await tokenRoot.methods
        .deployWallet({ answerId: 0, walletOwner: ownerAccount.address, deployWalletValue: toNano(2) } as never)
        .call()) as any;
      const tokenWalletContract = new locklift.provider.Contract(tokenWalletAbi, tokenWalletAddress);
      // console.log(tokenWalletContract);
      // const tokenWalletContract = await locklift.factory.getDeployedContract("TokenWallet", tokenWalletAddress);
      // console.log(tokenWalletContract);

      const res = await tokenWalletContract.methods.balance({ answerId: 0 });
      console.log(tokenWalletAddress);
      const { contract: platContract } = await locklift.factory.deployContract({
        contract: "StakingPlatform",
        publicKey: signer.publicKey,
        initParams: {
          _nonce: getRandomNonce(),
          _stakerWalletCode: (await locklift.factory.getContractArtifacts("StakingPlatform")).code,
        },
        constructorParams: {
          distributedTokenRoot: tokenRoot.address,
          managerPublicKey: `0x${signer.publicKey}`,
          fixedAPY: 100,
          stakingDuration: 10,
          lockupDuration: 2,
          maxAmountStaked: 10000,
          sendRemainingGasTo: ownerAccount.address,
        },
        value: locklift.utils.toNano(3),
      });
      stakingPlatform = platContract;

      expect(await locklift.provider.getBalance(stakingPlatform.address).then(balance => Number(balance))).to.be.above(
        0,
      );
    });

    it("Deploying Wallet Contract", async function () {
      await stakingPlatform.methods
        .deployStakerWallet({ owner: walletAccount.address, sendRemainingGasTo: walletAccount.address })
        .send({ from: walletAccount.address, amount: toNano(2) });
      const walletAddress = await locklift.provider.getExpectedAddress(
        (
          await locklift.factory.getContractArtifacts("StakerWallet")
        ).abi,
        {
          tvc: (await locklift.factory.getContractArtifacts("StakerWallet")).tvc,
          initParams: {
            _managerPublicKey: `0x${signer.publicKey}`,
            _owner: walletAccount.address,
            _stakingPlatform: stakingPlatform.address,
          },
        },
      );
      stakerWallet = await locklift.factory.getDeployedContract("StakerWallet", walletAddress);
      expect(await locklift.provider.getBalance(stakerWallet.address).then(balance => Number(balance))).to.be.eq(0);
    });

    it("Deposit to platform", async function () {
      const res = await stakerWallet.methods.deposit({ amount: 1 }).sendExternal({ publicKey: signer.publicKey });
      console.log(res);
    });
  });
});
