"use client";
import chatStore from "@/store/chatStore";
import { useEffect, useRef } from "react";
import Message from "./Message";
import InputBar from "./InputBar";

const ChatWindow = () => {
	const chat = chatStore((state) => state.chat);
	const addMessage = chatStore((state) => state.addMessage);
	const bottomRef = useRef<HTMLDivElement>(null);

	// On mount, load mock messages if chat is empty
	useEffect(() => {
		if (chat.length === 0) {
			// Import mock messages and add them to the store
			import("@/data/mockData").then((mod) => {
				mod.messages.forEach((msg) => {
					const { id, ...rest } = msg;
					addMessage({
						type: rest.type as
							| "text"
							| "image"
							| "audio"
							| "code"
							| "spreadsheet"
							| "document",
						sender: rest.sender as "user" | "ai",
						content: rest.content,
						language: rest.language,
					});
				});
			});
		}
	}, []);

	// Scroll to bottom on new message
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chat]);
	return (
		<div className="flex-1 w-full px-4 mx-auto overflow-y-auto bg-gray-50 rounded-lg">
			<div className="space-y-4 pb-20">
				{chat.length === 0 && (
					<div className="text-gray-400 text-center mt-10 p-8 bg-white rounded-lg shadow-sm border border-gray-100">
						<h3 className="text-lg font-medium mb-2">
							Welcome to Adaptive Multimodal Chat!
						</h3>
						<p>
							No messages yet. Start the conversation by sending a
							message, image, code or other content types.
						</p>
					</div>
				)}
				{chat.map((msg) => (
					<Message key={msg.id} message={msg} />
				))}
				<div ref={bottomRef} />
			</div>
			<div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto px-4 pb-4">
				<InputBar />
			</div>
		</div>
	);
};

export default ChatWindow;
