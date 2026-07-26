import useWorkspace from "./useWorkspace";

export default function useEditor() {

  const {
    actions,
    activeTab,
    openFile,
  } = useWorkspace();

  function open(fileId) {
    return openFile(fileId);
  }

  function save(content) {

    if (!activeTab) {
      return;
    }

    actions.saveFile(
      activeTab,
      content
    );

  }

  function changeLanguage(language) {

    if (!activeTab) {
      return;
    }

    actions.changeLanguage(
      activeTab,
      language
    );

  }

  function duplicate() {

    if (!activeTab) {
      return;
    }

    return actions.duplicateFile(
      activeTab
    );

  }

  return {
    activeFileId: activeTab,
    open,
    save,
    changeLanguage,
    duplicate,
  };

}
