export async function splitTilemap(
	tilemapFile: File,
	tileWidth: number,
	tileHeight: number
): Promise<Tile[]> {
	const tilemapImage = await loadImageFromFile(tilemapFile);

	const rows = Math.floor(tilemapImage.height / tileHeight);
	const cols = Math.floor(tilemapImage.width / tileWidth);
	const tiles: Tile[] = [];

	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	if (!context) {
		throw new Error(
			"Canvas-Rendering-Context konnte nicht erstellt werden."
		);
	}

	canvas.width = tileWidth;
	canvas.height = tileHeight;

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			context.clearRect(0, 0, tileWidth, tileHeight);

			context.drawImage(
				tilemapImage,
				col * tileWidth,
				row * tileHeight,
				tileWidth,
				tileHeight,
				0,
				0,
				tileWidth,
				tileHeight
			);

			const imageData = context.getImageData(0, 0, tileWidth, tileHeight);
			const isEmpty = !imageData.data.some(
				(value, index) => index % 4 !== 3 && value !== 0
			);

			if (isEmpty) {
				continue;
			}

			const tileCanvas = document.createElement("canvas");
			tileCanvas.width = tileWidth;
			tileCanvas.height = tileHeight;
			const tileContext = tileCanvas.getContext("2d");

			if (!tileContext) {
				throw new Error(
					"Tile-Canvas-Rendering-Context konnte nicht erstellt werden."
				);
			}

			tileContext.drawImage(canvas, 0, 0);

			tiles.push({
				image: tileCanvas,
				x: col * tileWidth,
				y: row * tileHeight,
			});
		}
	}

	return tiles;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = (err) => reject(err);
			img.src = reader.result as string;
		};
		reader.onerror = (err) => reject(err);
		reader.readAsDataURL(file);
	});
}
