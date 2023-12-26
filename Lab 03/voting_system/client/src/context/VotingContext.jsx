import { ethers } from "ethers";
import { createContext, useEffect, useMemo, useState } from "react";
import { contractABI, contractAddress } from "../utils/Constants";

export const VotingContext = createContext();

const { ethereum } = window;

// use ether.js to get ethereum smart contract (for FE to interact with smart contract)
const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const votingContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return votingContract;
};

// eslint-disable-next-line react/prop-types
const VotingProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const votingContract = useMemo(() => {
    return getEthereumContract();
  }, []);

  const handleGetAllCandidates = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const { names, voteCounts } = await votingContract.getAllCandidates();

      const structuredCandidates = names.map((name, index) => ({
        id: index,
        name: name,
        votes: parseInt(voteCounts[index]._hex) / 10 ** 18,
      }));
      setCandidates(structuredCandidates);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  const handleGetCandidate = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  const handleVote = async (id) => {
    try {
      if (!ethereum) return alert("Please install metamask");
      if (!currentAccount) {
        const isConfirm = confirm("Please connect your wallet to vote");
        if (isConfirm) await connectWallet();
      } else {
        const paresedAmount = ethers.utils.parseEther("0.000001");
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: "0x661b3e741cd49fcc36315db9c88c1e080713a085",
              value: paresedAmount._hex,
            },
          ],
        });

        const transactionHash = await votingContract.vote(id);
        // wait for transaction send
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`);

        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

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
        handleGetAllCandidates,
        handleGetCandidate,
        candidates,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};

export default VotingProvider;
