import Web3 from "web3";
import { createContext, useEffect, useMemo, useState } from "react";
import { contractABI, contractAddress } from "../utils/Constants";

export const VotingContext = createContext();

const { ethereum } = window;

// use ether.js to get ethereum smart contract (for FE to interact with smart contract)
const getEthereumContract = () => {
  const web3 = new Web3(ethereum);
  const votingContract = new web3.eth.Contract(contractABI, contractAddress);

  return votingContract;
};

// eslint-disable-next-line react/prop-types
const VotingProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [isVote, setIsVote] = useState(false);

  const votingContract = useMemo(() => {
    return getEthereumContract();
  }, []);

  const handleGetAllCandidates = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const { names, voteCounts } = await votingContract.methods
        .getAllCandidates()
        .call({ from: currentAccount });

      console.log(names, voteCounts);

      const structuredCandidates = names.map((name, index) => ({
        id: index,
        name: name,
        votes: parseInt(voteCounts[index]),
      }));
      setCandidates(structuredCandidates);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  const handleGetCandidate = async (id) => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const candidate = await votingContract.methods
        .getCandidate(id)
        .call({ from: currentAccount });

      const structuredCandidate = {
        id: id,
        name: candidate.name,
        votes: parseInt(candidate.voteCount),
      };

      return structuredCandidate;
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
        if (!isVote) {
          const tx = await votingContract.methods.vote(id).send({
            from: currentAccount,
            to: contractAddress,
            value: 1000000000000,
          });
          setIsVote(true);
          console.log(`Transaction Hash: ${tx.transactionHash}`);

          window.location.reload();
        }
      }
    } catch (error) {
      setIsVote(false);

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

  // Check if MetaMask wallet is connected (or installed)
  const checkIfAccountIsVoting = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      setIsVote(
        await votingContract.methods.voterLookup(currentAccount).call()
      );
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
    checkIfAccountIsVoting();
  }, [currentAccount]);
  return (
    <VotingContext.Provider
      value={{
        checkIfWalletIsConnected,
        checkIfAccountChanged,
        connectWallet,
        currentAccount,
        setCurrentAccount,
        handleVote,
        handleGetAllCandidates,
        handleGetCandidate,
        candidates,
        isVote,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};

export default VotingProvider;
