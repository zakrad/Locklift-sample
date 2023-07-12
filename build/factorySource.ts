const sampleAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]},{"name":"setState","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]},{"name":"getDetails","inputs":[],"outputs":[{"name":"_state","type":"uint256"}]}],"data":[{"key":1,"name":"_nonce","type":"uint16"}],"events":[{"name":"StateChange","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"_nonce","type":"uint16"},{"name":"state","type":"uint256"}]} as const
const stakerWalletAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"distributedTokenRoot","type":"address"},{"name":"managerPublicKey","type":"uint256"},{"name":"fixedAPY","type":"uint128"},{"name":"stakingDuration","type":"uint128"},{"name":"lockupDuration","type":"uint128"},{"name":"maxAmountStaked","type":"uint128"},{"name":"lockupPeriod","type":"uint128"},{"name":"endPeriod","type":"uint128"},{"name":"totalStaked","type":"uint128"},{"name":"sendRemainingGasTo","type":"address"}],"outputs":[]},{"name":"onTokenWallet","inputs":[{"name":"value","type":"address"}],"outputs":[]},{"name":"deposit","inputs":[{"name":"amount","type":"uint128"}],"outputs":[]},{"name":"withdraw","inputs":[{"name":"amount","type":"uint128"}],"outputs":[]},{"name":"claimRewards","inputs":[],"outputs":[]},{"name":"_distributedTokenRoot","inputs":[],"outputs":[{"name":"_distributedTokenRoot","type":"address"}]},{"name":"_distributedTokenWallet","inputs":[],"outputs":[{"name":"_distributedTokenWallet","type":"address"}]},{"name":"_stakingDuration","inputs":[],"outputs":[{"name":"_stakingDuration","type":"uint128"}]},{"name":"_lockupDuration","inputs":[],"outputs":[{"name":"_lockupDuration","type":"uint128"}]},{"name":"_stakingMax","inputs":[],"outputs":[{"name":"_stakingMax","type":"uint128"}]},{"name":"_staked","inputs":[],"outputs":[{"name":"_staked","type":"uint128"}]},{"name":"_totalStaked","inputs":[],"outputs":[{"name":"_totalStaked","type":"uint128"}]},{"name":"_rewardsToClaim","inputs":[],"outputs":[{"name":"_rewardsToClaim","type":"uint128"}]},{"name":"_userStartTime","inputs":[],"outputs":[{"name":"_userStartTime","type":"uint128"}]},{"name":"_lockupPeriod","inputs":[],"outputs":[{"name":"_lockupPeriod","type":"uint128"}]},{"name":"_endPeriod","inputs":[],"outputs":[{"name":"_endPeriod","type":"uint128"}]},{"name":"_precision","inputs":[],"outputs":[{"name":"_precision","type":"uint128"}]},{"name":"_fixedAPY","inputs":[],"outputs":[{"name":"_fixedAPY","type":"uint128"}]}],"data":[{"key":1,"name":"_stakingPlatform","type":"address"},{"key":2,"name":"_owner","type":"address"},{"key":3,"name":"_managerPublicKey","type":"uint256"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"_stakingPlatform","type":"address"},{"name":"_owner","type":"address"},{"name":"_managerPublicKey","type":"uint256"},{"name":"_distributedTokenRoot","type":"address"},{"name":"_distributedTokenWallet","type":"address"},{"name":"_stakingDuration","type":"uint128"},{"name":"_lockupDuration","type":"uint128"},{"name":"_stakingMax","type":"uint128"},{"name":"_staked","type":"uint128"},{"name":"_totalStaked","type":"uint128"},{"name":"_rewardsToClaim","type":"uint128"},{"name":"_userStartTime","type":"uint128"},{"name":"_lockupPeriod","type":"uint128"},{"name":"_endPeriod","type":"uint128"},{"name":"_precision","type":"uint128"},{"name":"_fixedAPY","type":"uint128"}]} as const
const stakingPlatformAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"distributedTokenRoot","type":"address"},{"name":"managerPublicKey","type":"uint256"},{"name":"fixedAPY","type":"uint128"},{"name":"stakingDuration","type":"uint128"},{"name":"lockupDuration","type":"uint128"},{"name":"maxAmountStaked","type":"uint128"},{"name":"sendRemainingGasTo","type":"address"}],"outputs":[]},{"name":"onTokenWallet","inputs":[{"name":"value","type":"address"}],"outputs":[]},{"name":"deployStakerWallet","inputs":[{"name":"owner","type":"address"},{"name":"sendRemainingGasTo","type":"address"}],"outputs":[]},{"name":"onWithdraw","inputs":[{"name":"amount","type":"uint128"},{"name":"owner","type":"address"}],"outputs":[]},{"name":"onClaimRewards","inputs":[{"name":"rewards","type":"uint128"},{"name":"owner","type":"address"}],"outputs":[]},{"name":"totalStaked","inputs":[],"outputs":[{"name":"value0","type":"uint128"}]},{"name":"_owner","inputs":[],"outputs":[{"name":"_owner","type":"address"}]},{"name":"_managerPublicKey","inputs":[],"outputs":[{"name":"_managerPublicKey","type":"uint256"}]},{"name":"_distributedTokenRoot","inputs":[],"outputs":[{"name":"_distributedTokenRoot","type":"address"}]},{"name":"_distributedTokenWallet","inputs":[],"outputs":[{"name":"_distributedTokenWallet","type":"address"}]},{"name":"_stakingDuration","inputs":[],"outputs":[{"name":"_stakingDuration","type":"uint128"}]},{"name":"_lockupDuration","inputs":[],"outputs":[{"name":"_lockupDuration","type":"uint128"}]},{"name":"_stakingMax","inputs":[],"outputs":[{"name":"_stakingMax","type":"uint128"}]},{"name":"_lockupPeriod","inputs":[],"outputs":[{"name":"_lockupPeriod","type":"uint128"}]},{"name":"_endPeriod","inputs":[],"outputs":[{"name":"_endPeriod","type":"uint128"}]},{"name":"_totalStaked","inputs":[],"outputs":[{"name":"_totalStaked","type":"uint128"}]},{"name":"_precision","inputs":[],"outputs":[{"name":"_precision","type":"uint128"}]},{"name":"_fixedAPY","inputs":[],"outputs":[{"name":"_fixedAPY","type":"uint128"}]}],"data":[{"key":1,"name":"_nonce","type":"uint16"},{"key":2,"name":"_stakerWalletCode","type":"cell"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"_nonce","type":"uint16"},{"name":"_stakerWalletCode","type":"cell"},{"name":"_owner","type":"address"},{"name":"_managerPublicKey","type":"uint256"},{"name":"_distributedTokenRoot","type":"address"},{"name":"_distributedTokenWallet","type":"address"},{"name":"_stakingDuration","type":"uint128"},{"name":"_lockupDuration","type":"uint128"},{"name":"_stakingMax","type":"uint128"},{"name":"_lockupPeriod","type":"uint128"},{"name":"_endPeriod","type":"uint128"},{"name":"_totalStaked","type":"uint128"},{"name":"_precision","type":"uint128"},{"name":"_fixedAPY","type":"uint128"}]} as const
const tokenRootAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"initialSupplyTo","type":"address"},{"name":"initialSupply","type":"uint128"},{"name":"deployWalletValue","type":"uint128"},{"name":"mintDisabled","type":"bool"},{"name":"burnByRootDisabled","type":"bool"},{"name":"burnPaused","type":"bool"},{"name":"remainingGasTo","type":"address"}],"outputs":[]},{"name":"supportsInterface","inputs":[{"name":"answerId","type":"uint32"},{"name":"interfaceID","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"disableMint","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"mintDisabled","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"burnTokens","inputs":[{"name":"amount","type":"uint128"},{"name":"walletOwner","type":"address"},{"name":"remainingGasTo","type":"address"},{"name":"callbackTo","type":"address"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"disableBurnByRoot","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"burnByRootDisabled","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"burnPaused","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"setBurnPaused","inputs":[{"name":"answerId","type":"uint32"},{"name":"paused","type":"bool"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"transferOwnership","inputs":[{"name":"newOwner","type":"address"},{"name":"remainingGasTo","type":"address"},{"components":[{"name":"value","type":"uint128"},{"name":"payload","type":"cell"}],"name":"callbacks","type":"map(address,tuple)"}],"outputs":[]},{"name":"name","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"string"}]},{"name":"symbol","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"string"}]},{"name":"decimals","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"uint8"}]},{"name":"totalSupply","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"uint128"}]},{"name":"walletCode","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"cell"}]},{"name":"rootOwner","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"address"}]},{"name":"walletOf","inputs":[{"name":"answerId","type":"uint32"},{"name":"walletOwner","type":"address"}],"outputs":[{"name":"value0","type":"address"}]},{"name":"deployWallet","inputs":[{"name":"answerId","type":"uint32"},{"name":"walletOwner","type":"address"},{"name":"deployWalletValue","type":"uint128"}],"outputs":[{"name":"tokenWallet","type":"address"}]},{"name":"mint","inputs":[{"name":"amount","type":"uint128"},{"name":"recipient","type":"address"},{"name":"deployWalletValue","type":"uint128"},{"name":"remainingGasTo","type":"address"},{"name":"notify","type":"bool"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"acceptBurn","id":"0x192B51B1","inputs":[{"name":"amount","type":"uint128"},{"name":"walletOwner","type":"address"},{"name":"remainingGasTo","type":"address"},{"name":"callbackTo","type":"address"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"sendSurplusGas","inputs":[{"name":"to","type":"address"}],"outputs":[]}],"data":[{"key":1,"name":"name_","type":"string"},{"key":2,"name":"symbol_","type":"string"},{"key":3,"name":"decimals_","type":"uint8"},{"key":4,"name":"rootOwner_","type":"address"},{"key":5,"name":"walletCode_","type":"cell"},{"key":6,"name":"randomNonce_","type":"uint256"},{"key":7,"name":"deployer_","type":"address"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"name_","type":"string"},{"name":"symbol_","type":"string"},{"name":"decimals_","type":"uint8"},{"name":"rootOwner_","type":"address"},{"name":"walletCode_","type":"cell"},{"name":"totalSupply_","type":"uint128"},{"name":"burnPaused_","type":"bool"},{"name":"burnByRootDisabled_","type":"bool"},{"name":"mintDisabled_","type":"bool"},{"name":"randomNonce_","type":"uint256"},{"name":"deployer_","type":"address"}]} as const
const tokenWalletAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[],"outputs":[]},{"name":"supportsInterface","inputs":[{"name":"answerId","type":"uint32"},{"name":"interfaceID","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"destroy","inputs":[{"name":"remainingGasTo","type":"address"}],"outputs":[]},{"name":"burnByRoot","inputs":[{"name":"amount","type":"uint128"},{"name":"remainingGasTo","type":"address"},{"name":"callbackTo","type":"address"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"burn","inputs":[{"name":"amount","type":"uint128"},{"name":"remainingGasTo","type":"address"},{"name":"callbackTo","type":"address"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"balance","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"uint128"}]},{"name":"owner","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"address"}]},{"name":"root","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"address"}]},{"name":"walletCode","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"cell"}]},{"name":"transfer","inputs":[{"name":"amount","type":"uint128"},{"name":"recipient","type":"address"},{"name":"deployWalletValue","type":"uint128"},{"name":"remainingGasTo","type":"address"},{"name":"notify","type":"bool"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"transferToWallet","inputs":[{"name":"amount","type":"uint128"},{"name":"recipientTokenWallet","type":"address"},{"name":"remainingGasTo","type":"address"},{"name":"notify","type":"bool"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"acceptTransfer","id":"0x67A0B95F","inputs":[{"name":"amount","type":"uint128"},{"name":"sender","type":"address"},{"name":"remainingGasTo","type":"address"},{"name":"notify","type":"bool"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"acceptMint","id":"0x4384F298","inputs":[{"name":"amount","type":"uint128"},{"name":"remainingGasTo","type":"address"},{"name":"notify","type":"bool"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"sendSurplusGas","inputs":[{"name":"to","type":"address"}],"outputs":[]}],"data":[{"key":1,"name":"root_","type":"address"},{"key":2,"name":"owner_","type":"address"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"root_","type":"address"},{"name":"owner_","type":"address"},{"name":"balance_","type":"uint128"}]} as const
const tokensaleAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"distributedTokenRoot","type":"address"},{"name":"supply","type":"uint256"},{"name":"rate","type":"uint128"},{"name":"sendRemainingGasTo","type":"address"}],"outputs":[]},{"name":"onTokenWallet","inputs":[{"name":"value","type":"address"}],"outputs":[]},{"name":"buyTokens","inputs":[{"name":"deposit","type":"uint128"}],"outputs":[]},{"name":"_distributedTokenRoot","inputs":[],"outputs":[{"name":"_distributedTokenRoot","type":"address"}]},{"name":"_distributedTokenWallet","inputs":[],"outputs":[{"name":"_distributedTokenWallet","type":"address"}]},{"name":"_supply","inputs":[],"outputs":[{"name":"_supply","type":"uint256"}]},{"name":"_rate","inputs":[],"outputs":[{"name":"_rate","type":"uint128"}]}],"data":[{"key":1,"name":"_nonce","type":"uint16"},{"key":2,"name":"_owner","type":"address"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"_nonce","type":"uint16"},{"name":"_owner","type":"address"},{"name":"_distributedTokenRoot","type":"address"},{"name":"_distributedTokenWallet","type":"address"},{"name":"_supply","type":"uint256"},{"name":"_rate","type":"uint128"}]} as const

export const factorySource = {
    Sample: sampleAbi,
    StakerWallet: stakerWalletAbi,
    StakingPlatform: stakingPlatformAbi,
    TokenRoot: tokenRootAbi,
    TokenWallet: tokenWalletAbi,
    Tokensale: tokensaleAbi
} as const

export type FactorySource = typeof factorySource
export type SampleAbi = typeof sampleAbi
export type StakerWalletAbi = typeof stakerWalletAbi
export type StakingPlatformAbi = typeof stakingPlatformAbi
export type TokenRootAbi = typeof tokenRootAbi
export type TokenWalletAbi = typeof tokenWalletAbi
export type TokensaleAbi = typeof tokensaleAbi
