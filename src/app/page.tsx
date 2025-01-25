"use client";

import { useEffect, useState } from "react";
import { splitTilemap } from "@/services/tile-map-splitter";
import DragAndDropField from "@/components/DragAndDropField";
import TileEditor from "@/components/TileEditor";

export default function Home() {
	const [files, setFiles] = useState<File[]>([]);
	const [showEditor, setShowEditor] = useState(false);
	const [tiles, setTiles] = useState<Tile[]>([]);

	useEffect(() => {
		if (files.length > 0) {
			setShowEditor(true);

			(async () => {
				const tileWidth = 32;
				const tileHeight = 32;

				try {
					const tiles = await splitTilemap(
						files[0],
						tileWidth,
						tileHeight
					);

					setTiles(tiles);
				} catch (err) {
					console.error("Fehler beim Aufteilen der Tilemap:", err);
				}
			})();
		}
	}, [files]);

	return (
		<section className="flex items-center justify-center h-screen bg-gray-100 p-8 py-32">
			{showEditor ? (
				<TileEditor tiles={tiles} />
			) : (
				<DragAndDropField setFiles={setFiles} />
			)}
		</section>
	);
}
