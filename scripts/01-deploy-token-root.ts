import { Address, getRandomNonce, toNano, zeroAddress } from "locklift";
import BigNumber from "bignumber.js";
async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  // Address of initial token supply recipient (write your own)
  const initialSupplyTo = new Address(`0:${signer.publicKey}`);
  // Address of token owner (write your own)
  const rootOwner = new Address(`0:${signer.publicKey}`);
  // Name of the token
  const name = "First Everscale Token";
  // Symbol of the token
  const symbol = "FET";
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

  /*
  Returns compilation artifacts based on the .sol file name
  or name from value config.externalContracts[pathToLib].
  */
  const TokenWallet = locklift.factory.getContractArtifacts("TokenWallet");

  /*
  Deploy the TIP-3 Token Root contract.
  @params deployWalletValue: Along with the deployment of the root token,
  the wallet will be automatically deployed to the owner.
  This is the amount of EVERs that will be sent to the wallet.
  */
  const { contract: tokenRoot } = await locklift.factory.deployContract({
    contract: "TokenRoot",
    publicKey: signer.publicKey,
    initParams: {
      // this field should be zero address if deploying with public key (see source code)
      deployer_: zeroAddress,
      randomNonce_: getRandomNonce(),
      rootOwner_: rootOwner,
      name_: name,
      symbol_: symbol,
      decimals_: decimals,
      walletCode_: TokenWallet.code,
    },
    constructorParams: {
      initialSupplyTo: initialSupplyTo,
      initialSupply: new BigNumber(initialSupply).shiftedBy(decimals).toFixed(),
      deployWalletValue: toNano(3),
      mintDisabled: disableMint,
      burnByRootDisabled: disableBurnByRoot,
      burnPaused: pauseBurn,
      remainingGasTo: zeroAddress,
    },
    value: toNano(5),
  });
  const deposit = new BigNumber(3).multipliedBy(10 ** 8).toString(); 
  const amount = new BigNumber(deposit).plus(new BigNumber(1).multipliedBy(10 ** 9)).toString();;
  console.log(`${name}: ${tokenRoot.address}`);
  const tokenWalletAddress = (await tokenRoot.methods.deployWallet({
    answerId: 0,
    walletOwner: rootOwner,
    deployWalletValue: toNano(2),
  })) as any;
  console.log(`${name}: ${tokenWalletAddress}`);

  // const tokenWalletContract = await locklift.factory.getDeployedContract("TokenWallet", tokenWalletAddress);
  // const res = await tokenWalletContract.methods.balance({ answerId: 0 }).call() as any;
  // console.log(res);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
