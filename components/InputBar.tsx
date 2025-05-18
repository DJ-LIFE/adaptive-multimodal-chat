"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import chatStore from "@/store/chatStore";
import {
	PaperclipIcon,
	CodeIcon,
	ImageIcon,
	TableIcon,
	FileIcon,
	MicIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import type { Message as MessageType } from "@/store/chatStore";

// Define the Message type if not imported from elsewhere
type Message = {
	id?: string | number;
	type: "text" | "image" | "audio" | "code" | "spreadsheet" | "document";
	sender: "user" | "ai";
	content: string;
};

const InputBar = () => {
	const [message, setMessage] = useState("");
	const [currentType, setCurrentType] = useState<
		"text" | "image" | "audio" | "code" | "spreadsheet" | "document"
	>("text");
	const addMessage = chatStore((state) => state.addMessage);
	const chat = chatStore((state) => state.chat);

	// Get the last message to provide context awareness
	const lastMessage = chat.length > 0 ? chat[chat.length - 1] : null;

	const handleSendMessage = () => {
		if (!message.trim()) return;

		// Send user message
		addMessage({
			type: currentType,
			sender: "user",
			content: message,
		});

		// Clear input
		setMessage("");

		// After user sends message, simulate AI response
		// For demo purposes only - in a real app, this would come from an API
		setTimeout(() => {
			let aiResponse: Omit<MessageType, "id"> = {
				type: currentType,
				sender: "ai",
				content: "",
			};

			// Context-aware responses based on message type
			switch (currentType) {
				case "text":
					aiResponse.content =
						"I understand your message. How can I help further?";
					break;
				case "image":
					aiResponse.content =
						"I've received your image. It looks interesting!";
					break;
				case "audio":
					aiResponse.content =
						"I've processed your audio. Thanks for sharing!";
					break;
				case "code":
					aiResponse.content =
						"Let me analyze this code snippet for you.";
					break;
				case "spreadsheet":
					aiResponse.content = "I've analyzed your spreadsheet data.";
					break;
				case "document":
					aiResponse.content = "I've reviewed your document.";
					break;
			}

			addMessage(aiResponse);
		}, 1000);

		// Reset to text input type after sending
		setCurrentType("text");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="flex flex-col w-full sticky bottom-0 bg-gray-100 p-2 rounded-lg">
			{lastMessage && (
				<div className="text-xs text-gray-500 mb-1 px-2">
					{lastMessage.type === "image" &&
						"Discussing an image. Want to annotate it?"}
					{lastMessage.type === "code" &&
						"Reviewing code. Need to explain or modify it?"}
					{lastMessage.type === "audio" &&
						"Discussing audio. Need a transcript?"}
				</div>
			)}

			<div className="text-xs font-medium mb-1 px-2">
				{currentType !== "text" && (
					<span className="text-blue-500">
						{currentType.charAt(0).toUpperCase() +
							currentType.slice(1)}{" "}
						mode
						<button
							onClick={() => setCurrentType("text")}
							className="ml-2 text-gray-500 hover:text-gray-700"
						>
							(cancel)
						</button>
					</span>
				)}
			</div>

			{/* Main input area */}
			<div className="flex items-center">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8 mr-2 cursor-pointer"
						>
							<PaperclipIcon className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-56">
						{" "}
						<div className="grid grid-cols-3 gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentType("image")}
								aria-label="Image input"
								className="cursor-pointer"
							>
								<ImageIcon className="h-4 w-4 mr-1" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentType("audio")}
								aria-label="Audio input"
								className="cursor-pointer"
							>
								<MicIcon className="h-4 w-4 mr-1" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentType("code")}
								aria-label="Code input"
								className="cursor-pointer"
							>
								<CodeIcon className="h-4 w-4 mr-1" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentType("spreadsheet")}
								aria-label="Spreadsheet input"
								className="cursor-pointer"
							>
								<TableIcon className="h-4 w-4 mr-1" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentType("document")}
								aria-label="Document input"
								className="cursor-pointer"
							>
								<FileIcon className="h-4 w-4 mr-1" />
							</Button>
						</div>
					</PopoverContent>
				</Popover>

				<Textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={
						currentType === "text"
							? "Type your message..."
							: currentType === "image"
							? "Describe your image or paste a URL..."
							: currentType === "audio"
							? "Describe your audio or paste a URL..."
							: currentType === "code"
							? "Paste your code snippet here..."
							: currentType === "spreadsheet"
							? "Paste spreadsheet data or describe it..."
							: "Describe your document or paste content..."
					}
					className="flex-1 border border-gray-300 bg-white rounded-lg py-2 px-4 mr-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<Button
					onClick={handleSendMessage}
					className="bg-blue-500 text-white rounded-full py-1 px-3 cursor-pointer hover:bg-blue-600"
				>
					<span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M12 5l0 14" />
							<path d="M18 11l-6 -6" />
							<path d="M6 11l6 -6" />
						</svg>
					</span>
				</Button>
			</div>
		</div>
	);
};

export default InputBar;
