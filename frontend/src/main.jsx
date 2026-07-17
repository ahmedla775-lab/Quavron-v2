import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./style.css";

import { AuthProvider } from "./components/auth/AuthProvider";

import { ProjectProvider } from "./context/ProjectContext";
import { FileProvider } from "./context/FileContext";
import { ProfileProvider } from "./context/ProfileContext";
import { PostProvider } from "./context/PostContext";
import { TabProvider } from "./context/TabContext";
import { TerminalProvider } from "./context/TerminalContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";

import { CommentsProvider } from "./modules/community/context/CommentsContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <AuthProvider>

      <ProjectProvider>

        <FileProvider>

          <ProfileProvider>

            <PostProvider>

              <CommentsProvider>

                <TabProvider>

                  <TerminalProvider>

                    <WorkspaceProvider>

                      <App />

                    </WorkspaceProvider>

                  </TerminalProvider>

                </TabProvider>

              </CommentsProvider>

            </PostProvider>

          </ProfileProvider>

        </FileProvider>

      </ProjectProvider>

    </AuthProvider>

  </React.StrictMode>

);
