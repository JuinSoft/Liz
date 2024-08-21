import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaWallet } from 'react-icons/fa';
import { FiCreditCard, FiDollarSign, FiBookOpen, FiHome } from 'react-icons/fi';
import { BsCheckCircle } from 'react-icons/bs';

const commonCss = "font-bold px-2 md:px-4 py-1 cursor-pointer rounded-2xl transition duration-200 flex ";

const NavItem = ({ to, content, icon }) => {
    return (
        <NavLink
            to={to}
            className={(navData) => navData.isActive ? commonCss + "bg-purple-500 text-white hover:bg-purple-600" : commonCss + "text-gray-300 hover:text-white"}
        >
            {React.createElement(icon, { className: "mr-2" })}
            {content}
        </NavLink>
    );
};

export default function Navbar({ walletConnected, handleWalletConnect, walletAddress, handleWalletDisconnect }) {
    const navItems = [
        { name: "Home", path: "/", icon: FiHome },
        { name: "Borrow", path: "/borrow", icon: FiBookOpen },
        { name: "My Borrows", path: "/my-borrows", icon: FiBookOpen },
        { name: "Lend", path: "/lend", icon: FiDollarSign },
        { name: "Credit Score", path: "/credit-score", icon: FiCreditCard },
    ];

    return (
        <header className="bg-gray-800 py-4 px-6 flex justify-between items-center">
            <nav className="flex space-x-6">
                {navItems.map(item => (
                    <NavItem key={item.name} to={item.path} content={item.name} icon={item.icon} />
                ))}
            </nav>
            <div className="flex-grow"></div> {/* Empty div for centering */}
            <div className="flex items-center h-10 px-3 rounded-xl cursor-pointer ml-2 border-[1px] border-transparent transition duration-200">
                <button
                    className={`bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md flex items-center space-x-2 ${walletConnected ? 'hidden' : ''}`}
                    onClick={handleWalletConnect}
                >
                    <FaWallet className="text-lg" />
                    <span>Connect Wallet</span>
                </button>
                {walletConnected && (
                    <div className="flex items-center space-x-2">
                        <BsCheckCircle className="text-green-500 text-lg" />
                        <span>Hello {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
                            onClick={handleWalletDisconnect}
                        >
                            Disconnect
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}