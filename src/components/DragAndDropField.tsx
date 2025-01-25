"use client";

import { useCallback, useState, useRef } from "react";

type Props = {
	setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function DragAndDropField({ setFiles }: Props) {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		const droppedFiles = Array.from(e.dataTransfer.files);
		setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
	}, [setFiles]);

	const onClick = () => {
		fileInputRef.current?.click();
	};

	const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
		}
	};

	return (
		<div className="flex flex-col items-center w-full h-screen">
			<div className="h-1/4 mt-8 text-center">
				<h2 className="text-2xl font-semibold text-gray-800">
					TheTileCompiler
				</h2>
				<span className="text-md font-medium  text-gray-800">
					Made by Jahid Uddin
				</span>
			</div>
			<div
				className={`w-1/2 h-1/2 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer ${
					isDragging
						? "border-blue-500 bg-blue-50"
						: "border-gray-300"
				}`}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				onClick={onClick}
			>
				<input
					type="file"
					ref={fileInputRef}
					onChange={onFileInputChange}
					className="hidden"
					multiple
				/>
				<p className="text-center text-gray-600">
					{isDragging
						? "Drop the tilemap"
						: "Drag the tilemap here or click to select"}
				</p>
			</div>
		</div>
	);
}
