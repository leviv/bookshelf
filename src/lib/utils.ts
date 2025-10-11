
export function getRandomPastel() {
  return [
		Math.floor(Math.random() * 106 + 150),
		Math.floor(Math.random() * 106 + 150),
		Math.floor(Math.random() * 106 + 150)
	];
}

export function getRandomPastelRGB(rgb: number[]) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/* Calculate text color based on brightness (white or black) */
export function getTextColor(rgb: number[]) {
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

export function getSpineWidth(numPages: number) {
  const minWidth = 15;
  return minWidth + numPages / 10;
}

export function getBookWidth(numPages: number, isBookOpen: boolean) {
  const spineWidth = getSpineWidth(numPages);

  if (isBookOpen) {
    return spineWidth + 150;
  }
  return spineWidth;
}
