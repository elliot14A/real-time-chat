"use client";
import React, { FC, useState } from "react";
import TextareaAutoSize from "react-textarea-autosize";
import Button from "./ui/button";
import { Icons } from "./ui/icons";
import axios from "axios";
import { toast } from "react-hot-toast";
interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

export const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const [input, setInput] = useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sendMessage = async () => {
    if (!input) return;
    setIsLoading(true);
    try {
      console.log("input", input);
      await axios.post("/api/messages/send", {
        text: input,
        chatId,
      });
      setInput("");
      console.log("input", input);
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="border-t border-black px-4 pt-4 mb-2 ">
      <div className="relative flex flex-row w-full overflow-hidden rounded-lg ring-1 ring-inset ring-black">
        <TextareaAutoSize
          value={input}
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0"
        />
        <div onClick={() => textareaRef.current?.focus} className="py-2">
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>
        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <Button
            isLoading={isLoading}
            onClick={sendMessage}
            className="flex items-center justify-center"
            type="submit"
          >
            {!isLoading ? <Icons.Logo className="h-full w-full" /> : ""}
          </Button>
        </div>
      </div>
    </div>
  );
};
