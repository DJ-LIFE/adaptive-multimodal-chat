"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

interface AnnotationToolProps {
	imageUrl: string;
	onSave: (annotations: Annotation[]) => void;
	onCancel: () => void;
}

type Annotation = {
	id: number;
	x: number;
	y: number;
	text: string;
	color: string;
};

const colors = [
	"#FF0000", // Red
	"#00FF00", // Green
	"#0000FF", // Blue
	"#FFFF00", // Yellow
	"#FF00FF", // Magenta
];

const AnnotationTool: React.FC<AnnotationToolProps> = ({
	imageUrl,
	onSave,
	onCancel,
}) => {
	const [annotations, setAnnotations] = useState<Annotation[]>([]);
	const [currentAnnotation, setCurrentAnnotation] =
		useState<Annotation | null>(null);
	const [inputText, setInputText] = useState("");
	const [selectedColor, setSelectedColor] = useState(colors[0]);
	const imageRef = useRef<HTMLImageElement>(null);

	const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
		if (!imageRef.current) return;

		const rect = imageRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Create a new annotation
		const newAnnotation: Annotation = {
			id: Date.now(),
			x,
			y,
			text: "",
			color: selectedColor,
		};

		setCurrentAnnotation(newAnnotation);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputText(e.target.value);
	};

	const handleAddAnnotation = () => {
		if (currentAnnotation && inputText.trim()) {
			const updatedAnnotation = {
				...currentAnnotation,
				text: inputText.trim(),
			};

			setAnnotations([...annotations, updatedAnnotation]);
			setCurrentAnnotation(null);
			setInputText("");
		}
	};

	const handleDeleteAnnotation = (id: number) => {
		setAnnotations(annotations.filter((ann) => ann.id !== id));
	};

	const handleSave = () => {
		onSave(annotations);
	};

	return (
		<div className="flex flex-col bg-white p-4 rounded-lg shadow-lg">
			<h2 className="text-xl font-bold mb-4">Image Annotation</h2>

			<div className="relative mb-4 border border-gray-300 rounded">
				<img
					ref={imageRef}
					src={imageUrl}
					alt="Image to annotate"
					className="max-w-full cursor-crosshair"
					onClick={handleImageClick}
				/>

				{/* Display existing annotations */}
				{annotations.map((ann) => (
					<div
						key={ann.id}
						className="absolute flex items-center group"
						style={{
							left: ann.x,
							top: ann.y,
							transform: "translate(-50%, -50%)",
						}}
					>
						<div
							className="w-5 h-5 rounded-full cursor-pointer"
							style={{ backgroundColor: ann.color }}
						></div>
						<div className="ml-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
							{ann.text}
							<button
								className="ml-2 text-red-400 hover:text-red-300"
								onClick={() => handleDeleteAnnotation(ann.id)}
							>
								×
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Color selection */}
			<div className="flex space-x-2 mb-4">
				{colors.map((color) => (
					<button
						key={color}
						className={`w-6 h-6 rounded-full ${
							selectedColor === color
								? "ring-2 ring-blue-500"
								: ""
						}`}
						style={{ backgroundColor: color }}
						onClick={() => setSelectedColor(color)}
					></button>
				))}
			</div>

			{/* Input for new annotation */}
			{currentAnnotation && (
				<div className="flex mb-4">
					<input
						type="text"
						value={inputText}
						onChange={handleInputChange}
						placeholder="Add annotation text"
						className="flex-1 border border-gray-300 rounded-l px-2 py-1"
					/>
					<Button onClick={handleAddAnnotation} className="rounded-r">
						Add
					</Button>
				</div>
			)}

			{/* Action buttons */}
			<div className="flex justify-end space-x-2">
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					onClick={handleSave}
					disabled={annotations.length === 0}
				>
					Save Annotations
				</Button>
			</div>
		</div>
	);
};

export default AnnotationTool;
