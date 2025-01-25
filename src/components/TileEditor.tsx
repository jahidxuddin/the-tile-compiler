"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Download, Grid } from "lucide-react";
import {
	downloadTileSet,
	downloadPlacedTiles,
} from "@/services/tile-map-downloader";
import Image from "next/image";

type Props = {
	tiles: Tile[];
};

export default function TileEditor({ tiles }: Props) {
	const [gridSize, setGridSize] = useState(16);
	const [placedTiles, setPlacedTiles] = useState<(number | null)[]>(
		Array(32 * 32).fill(null)
	);
	const [showGrid, setShowGrid] = useState(true);
	const [selectedTile, setSelectedTile] = useState<number | null>(null);
	const [isPlacing, setIsPlacing] = useState(false);

	const handleTilePlacement = (index: number) => {
		if (selectedTile === null) return;
		setPlacedTiles((prev) => {
			const newPlacedTiles = [...prev];
			newPlacedTiles[index] = selectedTile;
			return newPlacedTiles;
		});
	};

	const handleContextMenu = (e: React.MouseEvent, index: number) => {
		e.preventDefault();
		setPlacedTiles((prev) => {
			const newPlacedTiles = [...prev];
			newPlacedTiles[index] = null;
			return newPlacedTiles;
		});
	};

	const handleMouseDown = (index: number) => {
		setIsPlacing(true);
		handleTilePlacement(index);
	};

	const handleMouseUp = () => {
		setIsPlacing(false);
	};

	const handleMouseEnter = (index: number) => {
		if (isPlacing) {
			handleTilePlacement(index);
		}
	};

	return (
		<div className="flex h-screen w-full">
			<div className="flex-1 p-4 overflow-auto">
				<div className="mb-4 flex items-center gap-3">
					<input
						type="number"
						id="gridSize"
						min="1"
						max="32"
						value={gridSize}
						onChange={(e) =>
							setGridSize(
								Math.min(
									32,
									Math.max(1, Number.parseInt(e.target.value))
								)
							)
						}
						className="border rounded px-2 py-1"
						aria-label="Grid Size"
					/>
					<Button
						variant="outline"
						onClick={() => setShowGrid(!showGrid)}
						className="flex items-center px-2 py-1 text-sm"
					>
						{showGrid ? (
							<EyeOff className="mr-1 w-4 h-4" />
						) : (
							<Eye className="mr-1 w-4 h-4" />
						)}
						{showGrid ? "Hide" : "Show"}
					</Button>
					<Button
						variant="outline"
						onClick={() =>
							downloadPlacedTiles(placedTiles, gridSize)
						}
						className="flex items-center px-2 py-1 text-sm"
					>
						<Download className="mr-1 w-4 h-4" />
						Download Tilemap
					</Button>
					<Button
						variant="outline"
						onClick={() => downloadTileSet(tiles)}
						className="flex items-center px-2 py-1 text-sm"
					>
						<Download className="mr-1 w-4 h-4" />
						Download Tiles
					</Button>
				</div>

				<div
					className={`grid ${!showGrid && "border border-gray-300"}`}
					style={{
						gridTemplateColumns: `repeat(${gridSize}, 32px)`,
						gridTemplateRows: `repeat(${gridSize}, 32px)`,
						width: `${gridSize * 32 + (gridSize - 1)}px`,
						height: `${gridSize * 32 + (gridSize - 1)}px`,
					}}
					onMouseUp={handleMouseUp}
				>
					{Array.from({ length: gridSize * gridSize }).map(
						(_, index) => (
							<div
								key={index}
								className={`w-8 h-8 bg-gray-100 ${
									showGrid && "border border-gray-300"
								}`}
								onMouseDown={() => handleMouseDown(index)}
								onMouseEnter={() => handleMouseEnter(index)}
								onContextMenu={(e) =>
									handleContextMenu(e, index)
								}
							>
								{placedTiles[index] !== null && (
									<Image
										src={
											tiles[
												placedTiles[index] as number
											].image.toDataURL() ||
											"/placeholder.svg"
										}
										alt={`Placed Tile ${index}`}
										width={32}
										height={32}
										className="select-none pointer-events-none"
									/>
								)}
							</div>
						)
					)}
				</div>
			</div>

			<div className="w-64 p-4 overflow-y-auto border-l border-gray-300">
				<div className="grid grid-cols-4 gap-2">
					{tiles.map((tile, index) => (
						<div
							key={index}
							className={`cursor-pointer p-1 border-2 ${
								selectedTile === index
									? "border-blue-500"
									: "border-transparent hover:border-blue-500"
							}`}
							onClick={() => setSelectedTile(index)}
						>
							<Image
								src={
									tile.image.toDataURL() || "/placeholder.svg"
								}
								alt={`Tile ${index}`}
								width={32}
								height={32}
								className="select-none pointer-events-none"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
