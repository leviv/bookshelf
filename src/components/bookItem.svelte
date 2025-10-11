<script lang="ts">
	import {
		getBookWidth,
		getRandomPastel,
		getRandomPastelRGB,
		getSpineWidth,
		getTextColor
	} from '$lib/utils.js';
	import type { Book } from './bookTypes.js';
	import ColorThief from 'colorthief';

	export let book: Book;
	export let index: number;
	export let currentBookIndex: number;

	const ANIMATION_DURATION = 500;

	let prevBookIndex = -1;
	let isAnimating = false;

	// Track when this book starts animating (transitioning away from being selected)
	$: {
		const wasSelected = prevBookIndex === index;
		const isSelected = currentBookIndex === index;
		prevBookIndex = currentBookIndex;

		if (wasSelected && !isSelected) {
			isAnimating = true;
			setTimeout(() => {
				isAnimating = false;
			}, ANIMATION_DURATION);
		}
	}

	let bookImage: HTMLImageElement;
	let hasImage = false;

	// Reactive variables that update when book changes
	$: pastelColor = getRandomPastel();
	$: spineColor = getRandomPastelRGB(pastelColor);
	$: textColor = getTextColor(pastelColor);
	$: bookTitle = book.Title;

	// Calculate spine width based on number of pages - reactive
	$: numPages = book['Number of Pages'] || 0;
	$: spineWidth = getSpineWidth(numPages);
	$: bookWidth = getBookWidth(numPages, currentBookIndex === index);

	$: {
		console.log('numPages:', numPages);
		console.log('spineWidth:', spineWidth);
		console.log('bookWidth:', bookWidth);
	}

	const coverWidth = 166;
	const bookHeight = 220;

	// Reactive book cover URL that updates when book changes
	$: {
		const urlPrefix = 'https://covers.openlibrary.org/b/isbn/';
		const isbn = book.ISBN ? book.ISBN.substring(2, book.ISBN.length - 1) : '';
		const urlSuffix = '-M.jpg';
		bookCoverUrl = `${urlPrefix}${isbn}${urlSuffix}`;
		hasImage = false;
	}

	let bookCoverUrl = '';

	const handleImageLoad = () => {
		const getColor = () => {
			const colorThief = new ColorThief();
			const color = colorThief.getColor(bookImage);
			spineColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

			textColor = getTextColor(color);
			hasImage = true;
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
		--rotateY:{currentBookIndex === index ? '-60deg' : '0deg'};
		--animation-duration:{ANIMATION_DURATION}ms;
		"
>
	<span
		class="bookSpine"
		style="
		--bookHeight:{bookHeight}px; 
		--spineWidth:{spineWidth}px;"
	/>
	<h2 class="spineTitle" style="--height:{bookHeight}px">
		{bookTitle}
	</h2>
</div>
<div
	class="coverContainer"
	style="
		--rotateY:{currentBookIndex === index ? '30deg' : '88.8deg'};
		--spineColor:{spineColor}; 
		--textColor:{textColor}; 
		--bookHeight:{bookHeight}px; 
		--opacity:{currentBookIndex === index || isAnimating ? 1 : 0};
		--animation-duration:{ANIMATION_DURATION}ms;
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
	{#if !hasImage}
		<h2 class="bookTitle">{bookTitle}</h2>
		<h3 class="bookAuthor">{book.Author}</h3>
	{/if}
</div>

<style>
	.svgStyle {
		position: absolute;
		inset: 0;
		visibility: hidden;
		width: 0;
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
		position: absolute;
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
		font-family: 'Libre Baskerville', serif;
		writing-mode: vertical-rl;
		user-select: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-height: calc(100% - 24px);
	}

	.coverContainer {
		background-color: var(--spineColor);
		height: var(--bookHeight);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		position: relative;
		flex-shrink: 0;
		overflow: hidden;
		transform-origin: left center;
		transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(var(--rotateY))
			rotateZ(0deg) skew(0deg, 0deg);
		transition:
			height var(--animation-duration) ease,
			transform var(--animation-duration) ease;
		will-change: auto;
		filter: brightness(0.8) contrast(2);
		transform-style: preserve-3d;
		opacity: var(--opacity);
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	.bookTitle {
		position: absolute;
		font-family: 'Libre Baskerville', serif;
		padding: 10px;
		text-overflow: ellipsis;
		color: var(--textColor);
	}

	.bookAuthor {
		font-family: 'Josefin Sans', sans-serif;
	}

	.bookCover {
		pointer-events: none;
		position: absolute;
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
