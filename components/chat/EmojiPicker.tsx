"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

export function EmojiPicker({
  onEmojiSelect,
}: {
  onEmojiSelect: (emoji: any) => void;
}) {
  const { theme } = useTheme();

  return (
    <div className="glass rounded-lg shadow-lg">
      <Picker
        data={data}
        onEmojiSelect={onEmojiSelect}
        theme={theme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
