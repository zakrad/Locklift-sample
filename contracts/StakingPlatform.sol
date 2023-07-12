pragma ever-solidity >= 0.61.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

import "tip3/contracts/interfaces/IAcceptTokensTransferCallback.sol";
import "tip3/contracts/interfaces/ITokenRoot.sol";
import "tip3/contracts/interfaces/ITokenWallet.sol";
import "./StakerWallet.sol";

contract StakingPlatform {
    uint16  static _nonce; // some random value to affect on contract address

    TvmCell static _stakerWalletCode;

    address public _owner; // staking platform owner. will receive all transfers

    uint256 public _managerPublicKey;

    address public _distributedTokenRoot; // TIP3 TokenRoot address for deploying wallet for StakingPlatform. This token will be distributed
    address public _distributedTokenWallet; // TIP3 wallet for StakingPlatform for sending staked tokens
    uint128 public _stakingDuration; 
    uint128 public _lockupDuration; 
    uint128 public _stakingMax;

    uint128 public _lockupPeriod;
    uint128 public _endPeriod;

    uint128 public _totalStaked; 
    uint128 public _precision = 1000000; 
    
    uint128 public _fixedAPY;

    constructor(
        address distributedTokenRoot,
        uint256 managerPublicKey,
        uint128 fixedAPY,
        uint128 stakingDuration,
        uint128 lockupDuration,
        uint128 maxAmountStaked,
        address sendRemainingGasTo
    ) public {
        tvm.accept();
        tvm.rawReserve(1 ever, 0); // we will always reserve 1 ever on this contract
        _managerPublicKey = managerPublicKey;
        _distributedTokenRoot = distributedTokenRoot;
        _fixedAPY = fixedAPY;
        _stakingDuration = stakingDuration * 86400;
        _lockupDuration = lockupDuration * 86400;
        _stakingMax = maxAmountStaked;

        _lockupPeriod = block.timestamp + _lockupDuration;
        _endPeriod = block.timestamp + _stakingDuration;

        // fundamental mechanic of dapps working with tip3 - deploy it's own wallet to operate with. check tip3 specs for more info
        ITokenRoot(distributedTokenRoot).deployWallet {
            value: 0.2 ever,
            flag: 1,
            callback: StakingPlatform.onTokenWallet // this callback will be called by TokenRoot after deploying wallet for staking platform
        } (
            address(this),
            0.1 ever
        );
        // sending remaining gas after setups
        sendRemainingGasTo.transfer({ value: 0, flag: 128, bounce: false });
    }

    function onTokenWallet(address value) external {
        require (
            msg.sender.value != 0 &&
            msg.sender == _distributedTokenRoot,
            101
        );
        tvm.rawReserve(1 ever, 0);
        _distributedTokenWallet = value; // store deployed tip3 wallet address
        _owner.transfer({ value: 0, flag: 128, bounce: false }); // sending remaining gas after setups
    }

    function deployStakerWallet(address owner, address sendRemainingGasTo) external view {
        tvm.rawReserve(0.1 ever, 0);
        TvmCell walletStateInit = tvm.buildStateInit({
            contr: StakerWallet,
            // varInit section has an affect for target contract address calculation
            varInit: {
                _stakingPlatform: address(this),
                _managerPublicKey: _managerPublicKey,
                _owner: owner
            },
            code: _stakerWalletCode // we store it in state
        });
        new StakerWallet{
            stateInit: walletStateInit,
            value: 0,
            flag: 128
        }(
            _distributedTokenRoot, _managerPublicKey, _fixedAPY, _stakingDuration, _lockupDuration, _stakingMax, _lockupPeriod, _endPeriod, _totalStaked, sendRemainingGasTo
        ); 
    }

    function onWithdraw(uint128 amount, address owner) external {
        tvm.rawReserve(0.1 ever, 0);

        TvmCell walletStateInit = tvm.buildStateInit({
            contr: StakerWallet,
            varInit: {
                _stakingPlatform: address(this),
                _managerPublicKey: _managerPublicKey,
                _owner: owner
            },
            code: _stakerWalletCode
        });
        // so address is a hash from state init
        address expectedAddress = address(tvm.hash(walletStateInit));
        // and now we can just compare msg.sender address with calculated expected address
        // if its equals - calling ballot has the same code, that Vote stores and deploys
        if (msg.sender == expectedAddress) {
                TvmCell empty;
                ITokenWallet(_distributedTokenWallet).transfer{ value: 0, flag: 128 }(
                    amount,
                    owner,
                    0.1 ever, // this parameter allows to deploy wallet for user, if it's not deployed yet. (fee takes from message so will be payed by user)
                    owner,
                    false,
                    empty
            );
            owner.transfer({value: 0, flag: 128, bounce: false});
        } else {
            msg.sender.transfer({ value: 0, flag: 128, bounce: false });
        }
    }

    function onClaimRewards(uint128 rewards, address owner) external {
        tvm.rawReserve(0.1 ever, 0);
        // if you know init params of contract you can pretty simple calculate it's address
        TvmCell walletStateInit = tvm.buildStateInit({
            contr: StakerWallet,
            varInit: {
                _stakingPlatform: address(this),
                _managerPublicKey: _managerPublicKey,
                _owner: owner
            },
            code: _stakerWalletCode
        });
        // so address is a hash from state init
        address expectedAddress = address(tvm.hash(walletStateInit));
        // and now we can just compare msg.sender address with calculated expected address
        // if its equals - calling ballot has the same code, that Vote stores and deploys
        if (msg.sender == expectedAddress) {
                TvmCell empty;
                ITokenWallet(_distributedTokenWallet).transfer{ value: 0, flag: 128 }(
                    rewards,
                    owner,
                    0.1 ever, // this parameter allows to deploy wallet for user, if it's not deployed yet. (fee takes from message so will be payed by user)
                    owner,
                    false,
                    empty
            );
            owner.transfer({value: 0, flag: 128, bounce: false});
        } else {
            msg.sender.transfer({ value: 0, flag: 128, bounce: false });
        }
    }

    function totalStaked() external view returns (uint128) {
    return _totalStaked;
    }
}