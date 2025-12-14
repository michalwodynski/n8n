"use client";

import { useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import { Button } from "./ui/button";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const parentFolderId = process.env.NEXT_PUBLIC_PARENT_FOLDER_ID;

function GoogleDrivePicker({ value, onChange, disabled }) {
  const [openPicker] = useDrivePicker();
  const [folderName, setFolderName] = useState("");

  const handleOpenPicker = () => {
    if (!clientId || !apiKey) {
      console.error("Google Drive Picker: brak konfiguracji ENV");
      return;
    }

    openPicker({
      clientId: clientId,
      developerKey: apiKey,

      viewId: "FOLDERS",
      mimeTypes: ["application/vnd.google-apps.folder"],

      setSelectFolderEnabled: true,
      setParentFolder: parentFolderId,

      callbackFunction: (data) => {
        if (data.action === "cancel") return;

        const folder = data.docs?.[0];
        if (!folder) return;

        setFolderName(folder.name);
        onChange(folder.id);
      },
    });
  };

  return (
    <Button
      type="button"
      onClick={handleOpenPicker}
      disabled={disabled}
      className="w-full h-12 rounded-lg border border-gray-300 px-3 bg-white text-gray-700 focus:ring-0 cursor-pointer focus:border-black justify-start"
    >
      {value ? `Wybrano: ${folderName}` : "Wybierz folder w Google Drive"}
    </Button>
  );
}

export default GoogleDrivePicker;
