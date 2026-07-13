import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const ProjectContext = createContext(null);

const initialProject = null;

export function ProjectProvider({ children }) {

  const [project, setProject] = useState(initialProject);

  const renameProject = (name) => {
    setProject((prev) => ({
      ...prev,
      name,
    }));
  };

  const value = useMemo(
  () => ({
    project,
    setProject,
    renameProject,
    clearProject: () => setProject(null),
  }),
  [project]
);
  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {

  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error(
      "useProject must be used inside ProjectProvider"
    );
  }

  return context;
}

