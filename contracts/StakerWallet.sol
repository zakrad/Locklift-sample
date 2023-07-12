pragma ever-solidity >= 0.61.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

import "tip3/contracts/interfaces/IAcceptTokensTransferCallback.sol";
import "tip3/contracts/interfaces/ITokenRoot.sol";
import "tip3/contracts/interfaces/ITokenWallet.sol";
import "./interfaces/IStakingPlatform.sol";


contract StakerWallet {
    address static _stakingPlatform;

    address static _owner;

    uint256 static _managerPublicKey;

    address public _distributedTokenRoot; 
    address public _distributedTokenWallet;

    uint128 public _stakingDuration; 
    uint128 public _lockupDuration; 
    uint128 public _stakingMax;

    uint128 public _staked;
    uint128 public _totalStaked;
    
    uint128 public _rewardsToClaim;
    uint128 public _userStartTime;

    uint128 public _lockupPeriod;
    uint128 public _endPeriod;
    
    uint128 public _precision = 1000000; 
    
    uint128 public _fixedAPY;

    constructor(
        address distributedTokenRoot,
        uint256 managerPublicKey,
        uint128 fixedAPY,
        uint128 stakingDuration,
        uint128 lockupDuration,
        uint128 maxAmountStaked,
        uint128 lockupPeriod,
        uint128 endPeriod,
        uint128 totalStaked,
        address sendRemainingGasTo
    ) public {
        tvm.rawReserve(0.1 ever + 0.1 ever, 0);
        if (msg.sender != _stakingPlatform) {
            selfdestruct(msg.sender);
        }
        tvm.rawReserve(1 ever, 0); // we will always reserve 1 ever on this contract
        _managerPublicKey = managerPublicKey;
        _distributedTokenRoot = distributedTokenRoot;
        _fixedAPY = fixedAPY;
        _stakingDuration = stakingDuration;
        _lockupDuration = lockupDuration;
        _stakingMax = maxAmountStaked;
        _lockupPeriod = lockupPeriod;
        _endPeriod = endPeriod;
        _totalStaked = totalStaked;

        // fundamental mechanic of dapps working with tip3 - deploy it's own wallet to operate with. check tip3 specs for more info
        ITokenRoot(distributedTokenRoot).deployWallet {
            value: 0.2 ever,
            flag: 1,
            callback: StakerWallet.onTokenWallet
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

    function deposit(uint128 amount) external {
        require(msg.sender == _owner, 201);
        require(
            _endPeriod == 0 || _endPeriod > block.timestamp,
            202
        );
        require(
            _totalStaked + amount <= _stakingMax,
            203
        );
        require(amount != 0, 204);
        if (_userStartTime == 0) {
            _userStartTime = block.timestamp;
        }
        tvm.rawReserve(1 ever, 0);

        TvmCell empty;
        ITokenWallet(_distributedTokenWallet).transfer{ value: 0, flag: 128 }(
                    amount,
                    _stakingPlatform,
                    0.1 ever, // this parameter allows to deploy wallet for user, if it's not deployed yet. (fee takes from message so will be payed by user)
                    msg.sender,
                    false,
                    empty
        );

        _updateRewards();
        _staked += amount;

        _owner.transfer({ value: 0, flag: 128, bounce: false }); // sending remaining gas after setups
    }

    function withdraw(uint128 amount) external {
        require(msg.sender == _owner, 201);
        require(
            block.timestamp >= _lockupPeriod,
            205
        );
        require(amount != 0, 204);
        require(
            amount <= _staked,
            206
        );
        tvm.rawReserve(1 ever, 0);

        _updateRewards();
        if (_rewardsToClaim > 0) {
            _claimRewards();
        }

        IStakingPlatform(_stakingPlatform).onWithdraw{
            value: 0,
            flag: 128,
            bounce: true
        }(amount, _owner);
        _staked -= amount;
    }

    onBounce(TvmSlice bounce) external {
        uint32 functionId = bounce.decode(uint32);

        if (functionId == tvm.functionId(IStakingPlatform.onClaimRewards) && msg.sender == _stakingPlatform) {
            tvm.rawReserve(0.1 ever, 0);
            (uint128 rewards, ) = bounce.decodeFunctionParams(IStakingPlatform.onClaimRewards);
            _rewardsToClaim = rewards;
        } else if(functionId == tvm.functionId(IStakingPlatform.onWithdraw) && msg.sender == _stakingPlatform) {
            tvm.rawReserve(0.1 ever, 0);
            (uint128 amount, ) = bounce.decodeFunctionParams(IStakingPlatform.onWithdraw);
            _staked += amount;
        }
    }

    function claimRewards() external {
        require(msg.sender == _owner, 201);
        _claimRewards();
    }

    function _claimRewards() private {
        require(msg.sender == _owner, 201);

        _updateRewards();

        require(_rewardsToClaim > 0, 207);

        IStakingPlatform(_stakingPlatform).onClaimRewards{
            value: 0,
            flag: 128,
            bounce: true
        }(_rewardsToClaim, _owner);
        _rewardsToClaim = 0;
    }

    function _updateRewards() private {
        _rewardsToClaim = _calculateRewards();
        _userStartTime = (block.timestamp >= _endPeriod)
            ? _endPeriod
            : block.timestamp;
    }

    function _calculateRewards()
        private
        view
        returns (uint128)
    {
        if (_staked == 0) {
            return 0;
        }

        return
            (((_staked * _fixedAPY) *
                _percentageTimeRemaining()) / (_precision * 100)) +
            _rewardsToClaim;
    }

    function _percentageTimeRemaining()
        private
        view
        returns (uint128)
    {
        uint128 endPeriod = _endPeriod > block.timestamp ? block.timestamp : _endPeriod;
        return (_precision * (endPeriod - _userStartTime)) / _stakingDuration;
    }
}