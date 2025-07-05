// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IRVZToken {
    function burnFrom(address account, uint256 amount) external;
    function mint(address to, uint256 amount) external;
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract CauseRegistry is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public causeCount;
    address public rvzTokenAddress;
    uint256 public burnAmount;
    uint256 public rewardAmount;

    struct Cause {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 goal; // Meta de apoyos
        uint256 supportCount; // Número de personas que han apoyado
        uint256 createdAt;
    }

    mapping(uint256 => Cause) public causes;
    mapping(uint256 => mapping(address => bool)) public hasSupported;

    event CauseCreated(
        uint256 indexed id,
        address indexed creator,
        string title,
        string description,
        uint256 goal,
        uint256 createdAt
    );

    event CauseSupported(
        uint256 indexed causeId,
        address indexed supporter,
        uint256 newSupportCount
    );

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _rvzTokenAddress,
        uint256 _burnAmount,
        uint256 _rewardAmount
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        rvzTokenAddress = _rvzTokenAddress;
        burnAmount = _burnAmount;
        rewardAmount = _rewardAmount;
    }

    function createCause(
        string memory _title,
        string memory _description,
        uint256 _goal
    ) external {
        uint256 balance = IRVZToken(rvzTokenAddress).balanceOf(msg.sender);
        require(
            balance >= burnAmount,
            "Insufficient RVZ balance to create cause"
        );

        IRVZToken(rvzTokenAddress).burnFrom(msg.sender, burnAmount);

        causeCount++;
        causes[causeCount] = Cause({
            id: causeCount,
            creator: msg.sender,
            title: _title,
            description: _description,
            goal: _goal,
            supportCount: 0,
            createdAt: block.timestamp
        });

        emit CauseCreated(
            causeCount,
            msg.sender,
            _title,
            _description,
            _goal,
            block.timestamp
        );
    }

    function supportCause(uint256 _causeId) external {
        require(_causeId > 0 && _causeId <= causeCount, "Cause does not exist");
        require(
            !hasSupported[_causeId][msg.sender],
            "You have already supported this cause"
        );

        hasSupported[_causeId][msg.sender] = true;
        causes[_causeId].supportCount += 1;

        emit CauseSupported(
            _causeId,
            msg.sender,
            causes[_causeId].supportCount
        );

        // Mint reward tokens directly to supporter
        IRVZToken(rvzTokenAddress).mint(msg.sender, rewardAmount);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    // Update functions for owner to change parameters
    function updateBurnAmount(uint256 _newBurnAmount) external onlyOwner {
        burnAmount = _newBurnAmount;
    }

    function updateRewardAmount(uint256 _newRewardAmount) external onlyOwner {
        rewardAmount = _newRewardAmount;
    }

    function updateRVZTokenAddress(address _newAddress) external onlyOwner {
        rvzTokenAddress = _newAddress;
    }
}
