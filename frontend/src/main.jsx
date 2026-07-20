import React from "react";
import ReactDOM from "react-dom/client";
import { SocialHubProvider } from "./modules/socialhub/providers/SocialHubProvider";
import App from "./App";
import "./style.css";

import { AuthProvider } from "./components/auth/AuthProvider";

import { ProjectProvider } from "./context/ProjectContext";
import { FileProvider } from "./context/FileContext";
import { ProfileProvider } from "./context/ProfileContext";
import { PostProvider } from "./context/PostContext";
import { TabProvider } from "./context/TabContext";
import { TerminalProvider } from "./context/TerminalContext";

import { WorkspaceProvider } from "./modules/workspace/context/WorkspaceContext";
import { CommentsProvider } from "./modules/community/context/CommentsContext";

import { ThemeProvider } from "./theme/ThemeProvider";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <ThemeProvider>

      <AuthProvider>

        <ProjectProvider>

          <FileProvider>

            <ProfileProvider>

              <PostProvider>

                <CommentsProvider>

                  <TabProvider>

                    <TerminalProvider>

                      <SocialHubProvider>
  <WorkspaceProvider>
    <App />
  </WorkspaceProvider>
</SocialHubProvider>

                    </TerminalProvider>

                  </TabProvider>

                </CommentsProvider>

              </PostProvider>

            </ProfileProvider>

          </FileProvider>

        </ProjectProvider>

      </AuthProvider>

    </ThemeProvider>

  </React.StrictMode>
);
