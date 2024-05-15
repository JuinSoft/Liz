// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CreditScore {
    mapping(address => uint) private scores;
    address public owner;

    event CreditScoreUpdated(address indexed user, uint newScore);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    // Public function to get the credit score of a user
    function getCreditScore(address user) external view returns (uint) {
        return scores[user];
    }

    // Function to update the credit score, only accessible by the owner (or authorized contracts)
    function updateCreditScore(address user, int amount) external onlyOwner {
        if (amount < 0 && uint(-amount) > scores[user]) {
            scores[user] = 0; // Prevent underflow, set to 0 if deduction exceeds current score
        } else {
            scores[user] = uint(int(scores[user]) + amount);
        }
        emit CreditScoreUpdated(user, scores[user]);
    }

    // Allows the owner to set the credit score directly
    function setCreditScore(address user, uint score) external onlyOwner {
        scores[user] = score;
        emit CreditScoreUpdated(user, score);
    }

    // Function to authorize additional contracts or addresses to update credit scores
    // Placeholder for possible extension
    function authorizeUpdater(address updater) external onlyOwner {
        // Implementation to authorize another contract or address
    }
}
