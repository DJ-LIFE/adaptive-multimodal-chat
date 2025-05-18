import { create } from "zustand";

interface Message {
	id: number;
	type: "text" | "image" | "audio" | "code" | "spreadsheet" | "document";
	sender: "user" | "ai";
	content: string;
	language?: string; // for code
}

interface ChatStore {
	chat: Message[];
	addMessage: (msg: Omit<Message, "id">) => void;
}

let messageId = 1;

const chatStore = create<ChatStore>((set) => ({
	chat: [],
	addMessage: (msg) =>
		set((state) => ({
			chat: [...state.chat, { ...msg, id: messageId++ }],
		})),
}));

export type { Message };
export default chatStore;
