const generateTileText = (placedTiles: (number | null)[], gridSize: number) => {
	let tileText = "";

	for (let i = 0; i < placedTiles.length; i++) {
		const tile = placedTiles[i] !== null ? placedTiles[i] : -1;
		tileText += tile + " ";

		if ((i + 1) % gridSize === 0) {
			tileText += "\n";
		}

		if (i + 1 === gridSize**2) {
			break;
		}
	}

	return tileText;
};

const handleDownload = (placedTiles: (number | null)[], gridSize: number) => {
	const tileText = generateTileText(placedTiles, gridSize);
	const blob = new Blob([tileText], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = "tile-map.txt";
	link.click();
	URL.revokeObjectURL(url);
};

export { handleDownload };
