import React, { useState, useContext, useEffect } from 'react';
import { LizContext } from '../context/LizProvider';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ethers = require("ethers");
/* global BigInt */
export default function MyBorrows() {
    const { listUserLoans, repayEtherLoan } = useContext(LizContext);
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const data = await listUserLoans();
                if (!data) {
                    console.error('No data returned from listUserLoans');
                    return;
                }
                setLoans(data.filter(loan => loan[6] === false)); // Filter out loans where Paid is false
            } catch (error) {
                console.error('Error fetching loans:', error);
            }
        };
        fetchLoans();
    }, []);

    const handleRepayLoan = async (loan) => {
        const principalAmount = ethers.formatEther(loan[3].toString());
        const interestRate = parseFloat(loan[7].toString())/100;
        const interest = principalAmount * interestRate;
        const totalDue = parseFloat(principalAmount) + interest;
        await repayEtherLoan(loan[0], totalDue);
    }

    return (
        <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6 w-full max-w-6xl mx-auto mt-4">
            <h1 className="text-3xl font-bold mb-6">My Borrows</h1>
            {loans.length ? (
                <div className="overflow-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-200 uppercase bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                {/* <th scope="col" className="px-6 py-3">Borrower</th> */}
                                <th scope="col" className="px-6 py-3">Lender</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Valid Till</th>
                                <th scope="col" className="px-6 py-3">Funded</th>
                                <th scope="col" className="px-6 py-3">Paid</th>
                                <th scope="col" className="px-6 py-3">Interest Rate</th>
                                <th scope="col" className="px-6 py-3">Repay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan, index) => (
                                <tr key={index} className="bg-gray-800 border-b border-gray-700">
                                    <td className="px-6 py-4">{ethers.formatUnits(loan[0], 0)}</td>
                                    {/* No need to show the borrowers address */}
                                    {/* <td className="px-6 py-4">{loan[1]}</td> */}
                                    <td className="px-6 py-4">
                                        {loan[2] === '0x0000000000000000000000000000000000000000' ?
                                            'Unassigned' :
                                            `${loan[2].substring(0, 5)}...${loan[2].substring(loan[2].length - 4)}`}
                                    </td>
                                    <td className="px-6 py-4">{ethers.formatEther(loan[3])} XFI</td>
                                    <td className="px-6 py-4">{new Date(Number(loan[4]) * 1000).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{loan[5] ? 'Yes' : 'No'}</td>
                                    <td className="px-6 py-4">{loan[6] ? 'Yes' : 'No'}</td>
                                    <td className="px-6 py-4">{ethers.formatUnits(loan[7], 0)}%</td>
                                    <td className="px-6 py-4">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleRepayLoan(loan)}>
                                            Repay
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No borrows found</p>
            )}
            <div className="mt-6 text-sm text-gray-400">
                <p>Note 1: Interest rates are dynamic and based on credit score.</p>
                <p>Note 2: Credit score is also dynamic and gets updated based on on-chain activity, lending, and borrowing.</p>
            </div>
            <ToastContainer />
        </div>
    )
}

