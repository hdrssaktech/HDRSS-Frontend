import { createContext, useState } from "react";
import { parties } from "../utils/parties";

export const VoteContext = createContext();

export const VoteProvider = ({ children }) => {
  const [assembly, setAssembly] = useState(null);
  const [party, setParty] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const [voteCount, setVoteCount] = useState(
    parties.reduce((acc, p) => {
      acc[p] = 0;
      return acc;
    }, {})
  );

  const voteForParty = (selectedParty) => {
    if (hasVoted) return; 

    setParty(selectedParty);
    setHasVoted(true);

    setVoteCount((prev) => ({
      ...prev,
      [selectedParty]: prev[selectedParty] + 1,
    }));

    setTimeout(() => {
      setHasVoted(false);
    }, 5000);
  };

  return (
    <VoteContext.Provider
      value={{
        assembly,
        setAssembly,
        party,
        voteForParty,
        voteCount,
        hasVoted,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};


