<script lang="ts">
	import type { Book } from './bookTypes.js';
	import ColorThief from 'colorthief';

	export let book: Book;
	export let index: number;
	export let currentBookIndex: number;

	let bookImage: HTMLImageElement;
	let spineColor = '#cccccc';
	let textColor = '#ffffff';
	let spineWidth = 25;
	let bookCoverUrl = '';

	// Calculate spine width based on number of pages
	const numPages = book['Number of Pages'] || 0;
	const minWidth = 15;
	spineWidth = minWidth + numPages / 10;

	const coverWidth = 166;
	const bookHeight = 220;

	// Avoid fetching too many images
	if (index < 15) {
		const urlPrefix = 'https://covers.openlibrary.org/b/isbn/';
		const isbn = book.ISBN.substring(2, book.ISBN.length - 1);
		const urlSuffix = '-M.jpg';
		bookCoverUrl = `${urlPrefix}${isbn}${urlSuffix}`;
	}

	const handleImageLoad = () => {
		if (!bookImage || index > 15) {
			return;
		}

		const getColor = () => {
			const colorThief = new ColorThief();
			const color = colorThief.getColor(bookImage);
			spineColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

			// Calculate text color based on brightness
			const brightness = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
			textColor = brightness > 128 ? '#000000' : '#ffffff';
		};

		if (bookImage.complete) {
			getColor();
		} else {
			bookImage.addEventListener('load', function () {
				getColor();
			});
		}
	};

	const handleImageError = () => {
		spineColor = '#cccccc';
		textColor = '#ffffff';
	};
</script>

<svg class="svgStyle">
	<defs>
		<filter id="paper" x="0%" y="0%" width="100%" height="100%">
			<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="8" result="noise" />
			<feDiffuseLighting in="noise" lighting-color="white" surfaceScale="1" result="diffLight">
				<feDistantLight azimuth="45" elevation="35" />
			</feDiffuseLighting>
		</filter>
	</defs>
</svg>

<div
	class="spineContainer"
	style="
		--spineWidth:{spineWidth}px; 
		--bookHeight:{bookHeight}px; 
		--spineColor:{spineColor}; 
		--textColor:{textColor}; 
		--rotateY:{currentBookIndex === index ? '-60deg' : '0deg'}
		"
>
	<span
		class="bookSpine"
		style="
		--bookHeight:{bookHeight}px; 
		--spineWidth:{spineWidth}px;"
	/>
	<h2 class="spineTitle" style="--height:{bookHeight}px">
		{book.Title}
	</h2>
</div>
<div
	class="coverContainer"
	style="--rotateY:{currentBookIndex === index ? '30deg' : '88.8deg'}
	"
>
	<span class="bookCover" style="--bookHeight:{bookHeight}px; --coverWidth:{coverWidth}px;" />
	<span class="bookCoverDent" style="--bookHeight:{bookHeight}px; --coverWidth:{coverWidth}px;" />
	<img
		bind:this={bookImage}
		class={`bookCoverImage bookCover${index}`}
		src={bookCoverUrl}
		alt={book.Title}
		width={coverWidth}
		height={bookHeight}
		on:load={handleImageLoad}
		on:error={handleImageError}
		crossorigin="anonymous"
	/>
</div>

<style>
	.svgStyle {
		position: absolute;
		inset: 0;
		visibility: hidden;
	}

	.spineContainer {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		width: var(--spineWidth);
		height: var(--bookHeight);
		flex-shrink: 0;
		transform-origin: right center;
		background-color: var(--spineColor);
		color: var(--textColor);
		transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(var(--rotateY))
			rotateZ(0deg) skew(0deg, 0deg);
		transition: all 500ms ease;
		will-change: auto;
		filter: brightness(0.8) contrast(2);
		transform-style: preserve-3d;
	}

	.bookSpine {
		pointer-events: none;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		height: var(--bookHeight);
		width: var(--spineWidth);
		opacity: 0.4;
		filter: url(#paper);
	}

	.spineTitle {
		margin-left: 0;
		margin-right: 0;
		margin-top: 12px;
		font-size: 12px;
		font-family: 'DM Sans', sans-serif;
		writing-mode: vertical-rl;
		user-select: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-height: calc(100% - 24px);
	}

	.coverContainer {
		display: flex;
		position: relative;
		flex-shrink: 0;
		overflow: hidden;
		transform-origin: left center;
		transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(var(--rotateY))
			rotateZ(0deg) skew(0deg, 0deg);
		transition: all 500ms ease;
		will-change: auto;
		filter: brightness(0.8) contrast(2);
		transform-style: preserve-3d;
	}

	.bookCover {
		pointer-events: none;
		position: fixed;
		top: 0;
		right: 0;
		z-index: 50;
		height: var(--bookHeight);
		width: var(--coverWidth);
		opacity: 0.4;
		filter: url(#paper);
	}

	.bookCoverDent {
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 50;
		height: var(--bookHeight);
		width: var(--coverWidth);
		background: linear-gradient(
			to right,
			rgba(255, 255, 255, 0) 2px,
			rgba(255, 255, 255, 0.5) 3px,
			rgba(255, 255, 255, 0.25) 4px,
			rgba(255, 255, 255, 0.25) 6px,
			transparent 7px,
			transparent 9px,
			rgba(255, 255, 255, 0.25) 9px,
			transparent 12px
		);
	}

	.bookCoverImage {
		transition: all 500ms ease;
		will-change: auto;
	}
</style>
