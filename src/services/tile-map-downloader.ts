import JSZip from "jszip";

const generateTileText = (placedTiles: (number | null)[], gridSize: number) => {
	let tileText = "";

	for (let i = 0; i < placedTiles.length; i++) {
		const tile = placedTiles[i] !== null ? placedTiles[i] : -1;
		tileText += tile + " ";

		if ((i + 1) % gridSize === 0) {
			tileText += "\n";
		}

		if (i + 1 === gridSize ** 2) {
			break;
		}
	}

	return tileText;
};

const downloadPlacedTiles = (
	placedTiles: (number | null)[],
	gridSize: number
) => {
	const tileText = generateTileText(placedTiles, gridSize);
	const blob = new Blob([tileText], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = "tile-map.txt";
	link.click();
	URL.revokeObjectURL(url);
};

const downloadTileSet = async (tileSet: Tile[]) => {
	const zip = new JSZip();

	await Promise.all(
		tileSet.map(
			(tile, index) =>
				new Promise<void>((resolve, reject) => {
					const dataURL = tile.image.toDataURL("image/png");

					fetch(dataURL)
						.then((response) => response.blob())
						.then((blob) => {
							zip.file(`tile_${index + 1}.png`, blob);
							resolve();
						})
						.catch((error) => {
							console.error(
								"Error while converting tile to Blob:",
								error
							);
							reject(error);
						});
				})
		)
	);

	zip.generateAsync({ type: "blob" }).then((content) => {
		const a = document.createElement("a");
		const url = URL.createObjectURL(content);
		a.href = url;
		a.download = "tiles.zip";
		a.click();
		URL.revokeObjectURL(url);
	});
};

export { downloadPlacedTiles, downloadTileSet };
