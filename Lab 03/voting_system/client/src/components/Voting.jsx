import { useState } from "react";
import searchIcon from "../images/search.png";
import VotingCard from "./VotingCard";

const Voting = () => {
  const [candidateID, setCandidateID] = useState("");
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
        {[
          {
            id: "id-1",
            votes: 0,
            name: "Alice",
          },
          {
            id: "id-2",
            votes: 0,
            name: "Bob",
          },
          {
            id: "id-3",
            votes: 1,
            name: "Jacy",
          },
          {
            id: "id-4",
            votes: 4,
            name: "Tom",
          },
          {
            id: "id-5",
            votes: 0,
            name: "Thomas",
          },
          {
            id: "id-6",
            votes: 0,
            name: "John",
          },
          {
            id: "id-7",
            votes: 1,
            name: "Jeff",
          },
          {
            id: "id-8",
            votes: 4,
            name: "Amily",
          },
        ]
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
