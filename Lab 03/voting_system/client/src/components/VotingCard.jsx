import { useContext } from "react";
import { VotingContext } from "../context/VotingContext";

// eslint-disable-next-line react/prop-types
const VotingCard = ({ id, vote, name }) => {
  const { handleVote } = useContext(VotingContext);
  return (
    <div
      className="flex gap-2 flex-col basis-[30%] min-h-[400px] rounded-md bg-[rgba(0,0,0,0.35)] 
    shadow-md p-4"
    >
      <span className="text-white text-2xl font-medium">{name}</span>
      <section className="flex-1">
        <img
          className="w-full h-full rounded-md"
          src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${
            // eslint-disable-next-line react/prop-types
            name.split(" ")[0]
          }`}
          alt="avatar"
        />
      </section>
      <section className="text-white flex justify-between items-center text-xl mt-4">
        <p>
          ID: <span>{id}</span>
        </p>
        <p>
          Votes:{" "}
          <span className="bg-orange-400 px-2 py-1 font-medium rounded-sm">
            {vote}
          </span>
        </p>
      </section>
      <section className="flex">
        <button
          className="m-auto border-solid border-[2px] border-orange-400 text-white 
          font-medium px-6 py-2 rounded-full text-[18px] hover:bg-slate-700"
          onClick={() => {
            handleVote(id);
          }}
        >
          Vote
        </button>
      </section>
    </div>
  );
};

export default VotingCard;
