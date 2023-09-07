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
let signer: Signer;

describe("Test Sample contract2", async function () {
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
      const initialSupply = 100;
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

      const tokenWalletAddress = (
        await tokenRoot.methods.walletOf({ answerId: 0, walletOwner: ownerAccount.address } as never).call({})
      ).value0;
      console.log(tokenWalletAddress);
      // if (
      //   (
      //     await locklift.provider.getFullContractState({
      //       address: tokenWalletAddress,
      //     })
      //   ).state?.isDeployed
      // )
      //   throw new Error("You already have a token wallet of this token !");
      // const tokenWalletAddress = (await tokenRoot.methods
      //   .deployWallet({ answerId: 0, walletOwner: ownerAccount.address, deployWalletValue: toNano(2) } as never)) as any;
      // const tokenWalletContract = new locklift.provider.Contract(tokenWalletAbi, tokenWalletAddress);
      // console.log(tokenWalletContract);
      const tokenWalletContract = await locklift.factory.getDeployedContract("TokenWallet", tokenWalletAddress);
      // console.log(tokenWalletContract);

      const res = await tokenWalletContract.methods
        .transfer({
          amount: new BigNumber(initialSupply).shiftedBy(decimals).toFixed(),
          recipient: rootOwner,
          deployWalletValue: toNano(2),
          remainingGasTo: ownerAccount.address,
          notify: false,
          payload: "",
        })
        .send({
          from: ownerAccount.address,
          amount: locklift.utils.toNano("5"),
        });
        
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
      // console.log(res);
    });
  });
});
