import { createContext, useEffect, useState } from "react";

export const VotingContext = createContext();

const { ethereum } = window;

// eslint-disable-next-line react/prop-types
const VotingProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if MetaMask wallet is connected (or installed)
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  // handle to connect MetaMask wallet
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  // check if acccount MetaMask changed or locked
  const checkIfAccountChanged = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      ethereum.on("accountsChanged", (accounts) => {
        console.log("Account changed to:", accounts[0]);
        setCurrentAccount(accounts[0]);
      });
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  const handleVote = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      if (!currentAccount) {
        const isConfirm = confirm("Please connect your wallet to vote");
        if (isConfirm) await connectWallet();
      } else {
        alert("Vote");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfAccountChanged();
  });
  return (
    <VotingContext.Provider
      value={{
        checkIfWalletIsConnected,
        checkIfAccountChanged,
        connectWallet,
        currentAccount,
        setCurrentAccount,
        isLoading,
        setIsLoading,
        handleVote,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};

export default VotingProvider;
