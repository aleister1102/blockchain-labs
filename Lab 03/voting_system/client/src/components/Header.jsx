import { useContext } from "react";
import votingLogo from "../images/voting-box.png";
import { VotingContext } from "../context/VotingContext";
import shortenAddress from "../utils/ShortenAddress";

const Header = () => {
  const { connectWallet, currentAccount } = useContext(VotingContext);

  return (
    <div className="w-full flex shadow-lg py-4">
      <div className="flex justify-between m-auto w-full max-w-[1028px] items-center">
        <div className="flex items-center gap-3">
          <img className="w-10 h-10" src={votingLogo} alt="voting-logo" />
          <p
            className="bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500
            text-transparent font-bold text-xl"
          >
            DVS
          </p>
        </div>
        {currentAccount ? (
          <span
            className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 
          p-2 text-white rounded-md "
          >
            <span className="font-medium">Account ID: </span>
            <abbr title={currentAccount} style={{ textDecoration: "none" }}>
              {shortenAddress(currentAccount)}
            </abbr>
          </span>
        ) : (
          <button
            className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 
          p-2 text-white font-medium rounded-md"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
