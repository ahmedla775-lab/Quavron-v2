import { useState } from "react";

import useWorkspace from "./useWorkspace";

export default function useEditor() {

  const {

    actions,

  } = useWorkspace();

  const [activeFileId, setActiveFileId] =
    useState(null);

  function open(fileId) {

    const file =
      actions.openFile(fileId);

    if (!file) {

      return null;

    }

    setActiveFileId(fileId);

    return file;

  }

  function save(content) {

    if (!activeFileId) {

      return;

    }

    actions.saveFile(

      activeFileId,

      content

    );

  }

  function changeLanguage(language) {

    if (!activeFileId) {

      return;

    }

    actions.changeLanguage(

      activeFileId,

      language

    );

  }

  function duplicate() {

    if (!activeFileId) {

      return;

    }

    return actions.duplicateFile(

      activeFileId

    );

  }

  return {

    activeFileId,

    setActiveFileId,

    open,

    save,

    changeLanguage,

    duplicate,

  };

}
