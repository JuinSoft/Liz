// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./CreditScore.sol";

contract Liz {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    struct Loan {
        uint256 id;
        address borrower;
        address lender;
        uint amount;
        uint dueDate;
        bool isFunded;
        bool isPaid;
        uint interestRate; // Interest rate in percentage
    }

    address public owner;
    CreditScore private creditScore;
    Loan[] private loans;
    Counters.Counter private _loanIdCounter; // Counter for generating unique loan IDs
    mapping(address => uint[]) userLoans;

    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint amount);
    event LoanFunded(uint256 indexed loanId, address indexed lender);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower);

    constructor() {
        owner = msg.sender;
        creditScore = new CreditScore();
    }

    modifier onlyWithHighCreditScore(address _borrower) {
        require(creditScore.getCreditScore(_borrower) > 500, "Credit score too low");
        _;
    }

    function getCreditScore() public view returns (uint) {
        uint creditScore_ = creditScore.getCreditScore(msg.sender);
        return creditScore_;
    }

    function getBorrowerScore(address _borrower) public view returns (uint) {
        uint creditScore_ = creditScore.getCreditScore(_borrower);
        return creditScore_;
    }

    // for testing purpose the score is set to 700 initially
    function setInitialCreditScore(address _user) public {
        require(creditScore.getCreditScore(_user) == 0, "Credit score already initialized!");
        creditScore.updateCreditScore(_user, 700);
    }

    function calculateInterest(uint _creditScore) public pure returns (uint) {
        if (_creditScore > 700) {
            return 5; // Lower interest rate for high credit score
        } else if (_creditScore > 600) {
            return 10; // Medium interest rate
        } else {
            return 15; // Higher interest rate for lower scores
        }
    }

    function requestEtherLoan(uint _amount, uint _loanDurationDays) public onlyWithHighCreditScore(msg.sender) {
        uint creditScore_ = creditScore.getCreditScore(msg.sender);
        uint interestRate = calculateInterest(creditScore_);
        _loanIdCounter.increment();
        uint256 newLoanId = _loanIdCounter.current();
        loans.push(Loan({
            id: newLoanId,
            borrower: msg.sender,
            lender: address(0),
            amount: _amount,
            dueDate: block.timestamp + (_loanDurationDays * 1 days),
            isFunded: false,
            isPaid: false,
            interestRate: interestRate
        }));
        userLoans[msg.sender].push(newLoanId);
        creditScore.updateCreditScore(msg.sender, -20);
        emit LoanRequested(newLoanId, msg.sender, _amount);
    }

    function fundLoan(uint _loanId) public payable {
        require(_loanId > 0 && _loanId <= _loanIdCounter.current(), "Loan ID does not exist");
        Loan storage loan = loans[_loanId - 1]; // Adjust for zero-based index
        require(loan.borrower != address(0), "Invalid loan request");
        require(!loan.isFunded, "Loan already funded");
        loan.lender = msg.sender;
        loan.isFunded = true;
        payable(loan.borrower).transfer(loan.amount);
        emit LoanFunded(_loanId, msg.sender);
    }

    function repayEtherLoan(uint _loanId) public payable {
        require(_loanId > 0 && _loanId <= _loanIdCounter.current(), "Loan ID does not exist");
        Loan storage loan = loans[_loanId - 1]; // Adjust for zero-based index
        require(msg.sender == loan.borrower, "Only borrower can repay");
        require(loan.isFunded, "Loan not funded");
        uint totalDue = loan.amount.add(loan.amount.mul(loan.interestRate).div(100));
        require(!loan.isPaid, "Loan already repaid");
        loan.isPaid = true;
        payable(loan.lender).transfer(totalDue);
        creditScore.updateCreditScore(msg.sender, 30);
        emit LoanRepaid(_loanId, msg.sender);
    }

    // New function to list all loans that are not funded yet
    function listAvailableLoans() public view returns (Loan[] memory) {
        uint count;
        for (uint i = 0; i < loans.length; i++) {
            if (!loans[i].isFunded) {
                count++;
            }
        }

        Loan[] memory availableLoans = new Loan[](count);
        uint j = 0;
        for (uint i = 0; i < loans.length; i++) {
            if (!loans[i].isFunded) {
                availableLoans[j++] = loans[i];
            }
        }
        return availableLoans;
    }

    // Function to list all loans for a specific user
    function listUserLoans()public view returns (Loan[] memory) {
        uint count;
        address _user = msg.sender;
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].borrower == _user || (loans[i].lender == _user && loans[i].isFunded)) {
                count++;
            }
        }

        Loan[] memory involvedLoans = new Loan[](count);
        uint j = 0;
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].borrower == _user) {
                involvedLoans[j++] = loans[i];
            }
        }
        return involvedLoans;
    }


    // Function to list loans that have been funded but not yet repaid
    function listFundedButNotRepaidLoans() public view returns (Loan[] memory) {
        uint count;
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].isFunded && !loans[i].isPaid) {
                count++;
            }
        }

        Loan[] memory fundedLoans = new Loan[](count);
        uint j = 0;
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].isFunded && !loans[i].isPaid) {
                fundedLoans[j++] = loans[i];
            }
        }
        return fundedLoans;
    }

    // Function to list all the loans a user has either funded or borrowed
    function listUserInvolvedLoans(address _user) public view returns (Loan[] memory) {
        uint count;
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].lender == _user && loans[i].isFunded) {
                count++;
            }
        }

        Loan[] memory involvedLoans = new Loan[](count);
        uint j = 0;
        for (uint i = 0; i < loans.length; i++) {
            if (loans[i].lender == _user && loans[i].isFunded) {
                involvedLoans[j++] = loans[i];
            }
        }
        return involvedLoans;
    }

}