import { useEffect } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import IDELayout from "../components/ide/IDELayout";

import Explorer from "../components/ide/Explorer/Explorer";
import Editor from "../components/ide/Editor/Editor";
import Terminal from "../components/ide/Terminal/Terminal";
import RightSidebar from "../components/ide/RightSidebar";

import { useProject } from "../context/ProjectContext";
import { useFiles } from "../context/FileContext";

export default function IDE() {

  const { project } = useProject();

  const {
    loadFiles,
  } = useFiles();

  useEffect(() => {

    if (project?.id) {

      loadFiles(project.id);

    }

  }, [project]);

  return (

    <DashboardLayout>

      <IDELayout

        explorer={<Explorer />}

        tabs={null}

        editor={<Editor />}

        terminal={<Terminal />}

        rightbar={<RightSidebar />}

      />

    </DashboardLayout>

  );

}
