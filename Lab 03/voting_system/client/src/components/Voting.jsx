import { useContext, useEffect, useState } from "react";
import searchIcon from "../images/search.png";
import VotingCard from "./VotingCard";
import { VotingContext } from "../context/VotingContext";

const Voting = () => {
  const [candidateID, setCandidateID] = useState("");
  const { handleGetAllCandidates, candidates, currentAccount } =
    useContext(VotingContext);

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
          />
          <img
            src={searchIcon}
            alt="search-icon"
            className="w-[40px] h-[40px] cursor-pointer"
          />
        </div>
      </section>
      <section className="flex flex-wrap justify-evenly gap-10 min-h-[400px]">
        {candidates
          .filter((item) => {
            if (!candidateID) return true;
            return candidateID == item.id;
          })
          .map((item) => {
            return (
              <VotingCard
                key={item.id}
                id={item.id}
                vote={item.votes}
                name={item.name}
              />
            );
          })}
      </section>
    </div>
  );
};

export default Voting;
