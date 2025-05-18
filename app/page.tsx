import ChatWindow from "@/components/ChatWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-end bg-gray-100 h-screen max-w-4xl mx-auto">
			<ChatWindow />
		</div>
	);
}
