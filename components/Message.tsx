import React, { useState } from "react";
import type { Message as MessageType } from "@/store/chatStore";
import AnnotationTool from "./AnnotationTool";

interface MessageProps {
	message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
	const isUser = message.sender === "user";
	const [isAnnotating, setIsAnnotating] = useState(false);
	const [annotations, setAnnotations] = useState<any[]>([]);

	const handleAnnotationSave = (newAnnotations: any[]) => {
		setAnnotations(newAnnotations);
		setIsAnnotating(false);
	};
	return (
		<div
			className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}
		>
			<div
				className={`max-w-xs p-3 rounded-lg shadow-md ${
					isUser ? "bg-blue-500 text-white" : "bg-white text-gray-900"
				}`}
			>
				{/* Render by type */}
				{message.type === "text" && <span>{message.content}</span>}
				{message.type === "image" && (
					<div className="relative">
						{isAnnotating ? (
							<AnnotationTool
								imageUrl={message.content}
								onSave={handleAnnotationSave}
								onCancel={() => setIsAnnotating(false)}
							/>
						) : (
							<>
								<img
									src={message.content}
									alt="sent image"
									className="max-w-full max-h-48 rounded cursor-pointer"
									onClick={() => setIsAnnotating(true)}
								/>
								{annotations.length > 0 && (
									<div className="text-xs mt-1 italic">
										{annotations.length} annotation
										{annotations.length !== 1 ? "s" : ""}{" "}
										added
									</div>
								)}
								{!isUser && (
									<button
										className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full opacity-70 hover:opacity-100"
										onClick={() => setIsAnnotating(true)}
									>
										Annotate
									</button>
								)}
							</>
						)}
					</div>
				)}{" "}
				{message.type === "audio" && (
					<div className="audio-container">
						<div className="text-xs mb-1 opacity-70">
							Audio message
						</div>
						<audio
							controls
							src={message.content}
							className="w-full"
						/>
						<div className="flex justify-end mt-1">
							<button
								className="text-xs opacity-70 hover:opacity-100"
								onClick={() => {
									// This is a placeholder for transcription functionality
									console.log("Transcribe audio");
									// You would typically call an API here
								}}
							>
								Transcribe
							</button>
						</div>
					</div>
				)}
				{message.type === "code" && (
					<div className="code-container">
						<div className="flex justify-between items-center mb-1">
							<span className="text-xs opacity-70">
								{message.language || "code"}
							</span>
							<button
								className="text-xs opacity-70 hover:opacity-100"
								onClick={() => {
									navigator.clipboard.writeText(
										message.content
									);
									// You could add a toast notification here
								}}
							>
								Copy
							</button>
						</div>
						<pre className="bg-gray-900 text-green-200 p-2 rounded overflow-x-auto text-xs">
							<code>{message.content}</code>
						</pre>
					</div>
				)}{" "}
				{message.type === "spreadsheet" && (
					<div className="spreadsheet-preview">
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-medium">
								Spreadsheet Data
							</span>
							<button className="text-xs opacity-70 hover:opacity-100">
								View Full
							</button>
						</div>
						<div className="bg-gray-50 p-2 rounded border border-gray-200">
							<div className="grid grid-cols-3 gap-1 text-xs">
								<div className="bg-gray-200 p-1">Sample</div>
								<div className="bg-gray-200 p-1">Data</div>
								<div className="bg-gray-200 p-1">Columns</div>
								<div className="p-1">Value 1</div>
								<div className="p-1">Value 2</div>
								<div className="p-1">Value 3</div>
							</div>
							<div className="mt-2 text-xs text-center text-gray-500">
								[Simplified preview - click View Full for
								complete data]
							</div>
						</div>
					</div>
				)}
				{message.type === "document" && (
					<div className="document-preview">
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-medium">
								Document
							</span>
							<button className="text-xs opacity-70 hover:opacity-100">
								Open
							</button>
						</div>
						<div className="bg-gray-50 p-3 rounded border border-gray-200">
							<div className="flex items-center">
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
									className="text-gray-400 mr-2"
								>
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
									<polyline points="14 2 14 8 20 8"></polyline>
									<line x1="16" y1="13" x2="8" y2="13"></line>
									<line x1="16" y1="17" x2="8" y2="17"></line>
									<polyline points="10 9 9 9 8 9"></polyline>
								</svg>
								<div className="text-sm truncate">
									{message.content.split("/").pop() ||
										"Document"}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Message;
