import Header from "./components/Header";
import Voting from "./components/Voting";

function App() {
  return (
    <div className="w-full">
      <Header />
      <section className="w-full flex flex-col m-auto max-w-[1028px] pb-4">
        <h1 className="w-full text-xl text-white text-center my-10">
          <span
            className="bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500
            text-transparent font-bold text-xl"
          >
            DVS - Decentralized Voting System
          </span>
          <p className="mt-2">
            The voting website utilizes the Metamask Wallet to create and manage
            Ethereum accounts. It employs Ethers.js to interact with a smart
            contract written in Solidity.
          </p>
        </h1>
        <Voting />
      </section>
    </div>
  );
}

export default App;
