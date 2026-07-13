import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { useProject } from "./ProjectContext";

import FileManager from "../core/files/FileManager";
import FileService from "../services/FileService";

const FileContext = createContext(null);

export function FileProvider({ children }) {

  const { project } = useProject();

  const [files, setFiles] = useState([]);

  const [currentFile, setCurrentFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  async function loadFiles(projectId) {

    if (!projectId) {

      setFiles([]);

      setCurrentFile(null);

      return;

    }

    setLoading(true);

    const { data, error } =
      await FileService.getFiles(projectId);

    if (!error && data) {

      setFiles(data);

    }

    setLoading(false);

  }

  function openFile(file) {

    setCurrentFile(file);

  }

  async function createFile(name) {

    if (!project) return null;

    const file =
      FileManager.createFile(name);

    file.project_id = project.id;

    const { data, error } =
      await FileService.createFile(file);

if (error) {
  console.error("Create File Error:", error);
  throw new Error(error.message);
} 
    setFiles((prev) => [...prev, data]);

    setCurrentFile(data);

    return data;

  }

  async function createFolder(name) {

    if (!project) return null;

    const folder =
      FileManager.createFolder(name);

    folder.project_id = project.id;

    const { data, error } =
      await FileService.createFile(folder);

    if (error) throw error;

    setFiles((prev) => [...prev, data]);

    return data;

  }

  function updateFile(id, content) {

    setFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              content,
            }
          : file
      )
    );

    setCurrentFile((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            content,
          }
        : prev
    );

  }

async function deleteFile(id) {

  const { error } =
    await FileService.deleteFile(id);

  if (error) throw error;

  setFiles((prev) =>
    prev.filter((file) => file.id !== id)
  );

  setCurrentFile((prev) =>
    prev?.id === id ? null : prev
  );

}  
async function renameFile(id, name) {

  const { data, error } =
    await FileService.renameFile(id, name);

  if (error) throw error;

  setFiles((prev) =>
    prev.map((file) =>
      file.id === id ? data : file
    )
  );

  setCurrentFile((prev) =>
    prev?.id === id ? data : prev
  );

  return data;

}
  const value = useMemo(
  () => ({
    files,
    loading,
    currentFile,

    setFiles,
    setCurrentFile,

    loadFiles,
    openFile,

    createFile,
    createFolder,
    renameFile,

    updateFile,
    deleteFile,
  }),
   [
      files,
      loading,
      currentFile,
    ]
  );

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );

}

export function useFiles() {

  const context =
    useContext(FileContext);

  if (!context) {

    throw new Error(
      "useFiles must be used inside FileProvider"
    );

  }

  return context;

}
