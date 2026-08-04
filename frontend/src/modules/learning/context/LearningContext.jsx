import { createContext, useContext, useState } from "react";

const LearningContext = createContext(null);

export function LearningProvider({ children }) {
  const [page, setPage] = useState("feed");

  return (
    <LearningContext.Provider
      value={{
        page,
        setPage,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  return useContext(LearningContext);
}
