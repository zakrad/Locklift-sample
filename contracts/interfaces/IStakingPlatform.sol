
pragma ever-solidity >= 0.61.2;
pragma AbiHeader expire;

interface IStakingPlatform {
    function onClaimRewards(uint128 rewards,address owner) external;

    function onWithdraw(uint128 amount,address owner) external;
}