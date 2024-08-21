import React, { useState, useContext } from 'react';
import { LizContext } from '../context/LizProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function Borrow({ walletConnected, walletAddress }) {
    const [borrowAmount, setBorrowAmount] = useState('');
    const [loanDuration, setLoanDuration] = useState('7');
    const { requestEtherLoan } = useContext(LizContext);

    const handleBorrow = async () => {
        // Handle borrow logic here
        await requestEtherLoan(borrowAmount, loanDuration);
        setBorrowAmount('');
        setLoanDuration('7');
    };

    return (
        <div className="borrow-container" style={styles.borrowContainer}>
            <h1 style={styles.heading}>Borrow</h1>
            <div className="borrow-form" style={styles.borrowForm}>
                <label style={styles.label}>Amount</label>
                <div className="input-group" style={styles.inputGroup}>
                    <input
                        type="number"
                        placeholder="0.0"
                        min={0.0001}
                        value={borrowAmount}
                        onChange={(e) => setBorrowAmount(e.target.value)}
                        style={styles.input}
                    />
                    <span style={styles.inputGroupSpan}>XFI</span>
                </div>
                <label style={styles.label}>Loan Duration</label>
                <div className="loan-duration" style={styles.loanDuration}>
                    <button
                        style={{
                            ...styles.loanDurationButton,
                            ...(loanDuration === '7' && styles.loanDurationButtonActive),
                        }}
                        onClick={() => setLoanDuration('7')}
                    >
                        7 days
                    </button>
                    <button
                        style={{
                            ...styles.loanDurationButton,
                            ...(loanDuration === '14' && styles.loanDurationButtonActive),
                        }}
                        onClick={() => setLoanDuration('14')}
                    >
                        14 days
                    </button>
                    <button
                        style={{
                            ...styles.loanDurationButton,
                            ...(loanDuration === '30' && styles.loanDurationButtonActive),
                        }}
                        onClick={() => setLoanDuration('30')}
                    >
                        30 days
                    </button>
                </div>
                <button
                    className="connect-wallet"
                    style={styles.connectWalletButton}
                    onClick={walletConnected ? handleBorrow : undefined}
                >
                    {walletConnected ? 'Borrow' : 'Connect Wallet'}
                </button>
            </div>
            <div style={styles.infoBox}>
                <p>Please refresh your credit score before borrowing.</p>
            </div>
            <ToastContainer />
        </div>
    );
}

const styles = {
    infoBox: {
        backgroundColor: '#1e1e2f',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '30px',
        fontFamily: 'italic',
    },
    borrowContainer: {
        backgroundColor: '#1e1e2f',
        color: 'white',
        padding: '40px',
        borderRadius: '10px',
        maxWidth: '400px',
        margin: '100px auto 0',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '30px',
        textAlign: 'center',
    },
    borrowForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '10px',
        fontSize: '16px',
    },
    inputGroup: {
        display: 'flex',
        marginBottom: '20px',
    },
    input: {
        flex: '1',
        padding: '12px',
        backgroundColor: '#252540',
        border: 'none',
        color: 'white',
        borderRadius: '5px',
        fontSize: '16px',
    },
    inputGroupSpan: {
        backgroundColor: '#3a3a5a',
        padding: '12px',
        borderRadius: '0 5px 5px 0',
        fontSize: '16px',
    },
    loanDuration: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '30px',
    },
    loanDurationButton: {
        backgroundColor: '#252540',
        border: 'none',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    loanDurationButtonActive: {
        backgroundColor: '#3a3a5a',
    },
    connectWalletButton: {
        backgroundColor: '#007bff',
        border: 'none',
        color: 'white',
        padding: '12px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
    },
};

export default Borrow;