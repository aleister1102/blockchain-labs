import { useContext, useEffect, useState } from "react";
import searchIcon from "../images/search.png";
import VotingCard from "./VotingCard";
import { VotingContext } from "../context/VotingContext";

const Voting = () => {
  const [candidateID, setCandidateID] = useState("");
  const [candidate, setCandidate] = useState(undefined);
  const {
    handleGetAllCandidates,
    handleGetCandidate,
    candidates,
    currentAccount,
    isVote = false,
  } = useContext(VotingContext);

  useEffect(() => {
    handleGetAllCandidates();
  }, [currentAccount]);

  return (
    <div className="w-full">
      <section className="w-full flex mb-10">
        <div className="m-auto flex items-center rounded-full p-1 bg-white">
          <input
            placeholder="Search by Candidate's ID"
            className="w-[250px] mx-3 focus:outline-none"
            value={candidateID}
            onChange={(e) => {
              setCandidateID(e.target.value);
            }}
            onKeyUp={async (e) => {
              if (e.key === "Enter") {
                if (candidateID === "") {
                  setCandidate(undefined);
                } else {
                  const result = await handleGetCandidate(candidateID);
                  setCandidate(result);
                }
              }
            }}
          />
          <img
            src={searchIcon}
            alt="search-icon"
            className="w-[40px] h-[40px] cursor-pointer"
            onClick={async () => {
              if (candidateID === "") {
                setCandidate(undefined);
              } else {
                const result = await handleGetCandidate(candidateID);
                setCandidate(result);
              }
            }}
          />
        </div>
      </section>
      {isVote && (
        <h1 className="text-orange-400 text-3xl font-medium text-center mb-10">
          *** You already vote ***
        </h1>
      )}
      <section className="flex flex-wrap justify-evenly gap-10 min-h-[400px]">
        {!currentAccount ? (
          <h1 className="text-orange-400 text-xl text-center">
            Please connect to Metamask Wallet
          </h1>
        ) : candidate !== undefined ? (
          <VotingCard
            key={candidate.id}
            id={candidate.id}
            vote={candidate.votes}
            name={candidate.name}
          />
        ) : (
          candidates.map((item) => {
            return (
              <VotingCard
                key={item.id}
                id={item.id}
                vote={item.votes}
                name={item.name}
              />
            );
          })
        )}
      </section>
    </div>
  );
};

export default Voting;
