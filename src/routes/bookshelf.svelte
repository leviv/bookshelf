<script lang="ts" type="module">
	// Books data
	const books = [
		{
			title: 'On The Shortness of Life',
			author: 'Seneca',
			date: 'November 5, 2022',
			rating: '8',
			coverImage: 'https://m.media-amazon.com/images/I/41HlG+jCHDL._AC_SY780_.jpg',
			spineColor: '#192859',
			textColor: '#fff',
			review:
				"Seneca has one message here which is quite simple: life is short, but we make it much shorter by spending time on things that are unimportant. As simple as it is, it's necessary reminder, and Seneca delivers it in a unique way that brings up relevant points and makes you seriously think about how you're spending your time."
		},
		{
			title: 'On The Shortness of Life',
			author: 'Seneca',
			date: 'November 5, 2022',
			rating: '8',
			coverImage: 'https://m.media-amazon.com/images/I/41HlG+jCHDL._AC_SY780_.jpg',
			spineColor: '#192859',
			textColor: '#fff',
			review:
				"Seneca has one message here which is quite simple: life is short, but we make it much shorter by spending time on things that are unimportant. As simple as it is, it's necessary reminder, and Seneca delivers it in a unique way that brings up relevant points and makes you seriously think about how you're spending your time."
		},
		{
			title: 'On The Shortness of Life',
			author: 'Seneca',
			date: 'November 5, 2022',
			rating: '8',
			coverImage: 'https://m.media-amazon.com/images/I/41HlG+jCHDL._AC_SY780_.jpg',
			spineColor: '#192859',
			textColor: '#fff',
			review:
				"Seneca has one message here which is quite simple: life is short, but we make it much shorter by spending time on things that are unimportant. As simple as it is, it's necessary reminder, and Seneca delivers it in a unique way that brings up relevant points and makes you seriously think about how you're spending your time."
		}
	];

	let currentBookIndex = -1;
	let scroll = 0;

	const width = 41.5;
	const height = 220;

	const spineWidth = width;
	const coverWidth = width * 4;
	const bookWidth = width * 5;
	const bookHeight = height;

	let buttonWidth = spineWidth;

	$: bookClicked = (index: number) => {
		console.log('book clicked', index);
		currentBookIndex = index === currentBookIndex ? -1 : index;
		buttonWidth = bookWidth;
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

<div class="bookshelf">
	{#each books as book, index}
		<button
			class="book"
			on:click={() => bookClicked(index)}
			style="--scroll:{scroll}px; --width:{currentBookIndex === index ? bookWidth : spineWidth}px;"
		>
			<div
				class="spineContainer"
				style="--spineWidth:{spineWidth}px; --bookHeight:{bookHeight}px; --spineColor:{book.spineColor}; --textColor:{book.textColor}; --rotateY:{currentBookIndex ===
				index
					? '-60deg'
					: '0deg'}"
			>
				<span class="bookSpine" style="--bookHeight:{bookHeight}px; --spineWidth:{spineWidth}px;" />
				<h2 class="spineTitle" style="--height:{height}">
					{book.title}
				</h2>
			</div>
			<div
				class="coverContainer"
				style="--rotateY:{currentBookIndex === index ? '30deg' : '88.8deg'}"
			>
				<span class="bookCover" style="--bookHeight:{bookHeight}px; --coverWidth:{coverWidth}px;" />
				<span
					class="bookCoverDent"
					style="--bookHeight:{bookHeight}px; --coverWidth:{coverWidth}px;"
				/>
				<img
					class="bookCoverImage"
					src={book.coverImage}
					alt={book.title}
					width={coverWidth}
					height={bookHeight}
				/>
			</div>
		</button>
	{/each}
</div>

<style>
	.svgStyle {
		position: absolute;
		inset: 0;
		visibility: hidden;
	}

	.bookshelf {
		display: flex;
		gap: 20px;
	}

	.book {
		background-color: #00000000;
		border: none;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		outline: none;
		flex-shrink: 0;
		perspective: 1000px;
		-webkit-perspective: 1000px;
		gap: 0px;
		transform: translateX(var(--scroll) * -1);
		transition: all 500ms ease;
		will-change: auto;
		width: var(--width);
	}

	.spineContainer {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		width: var(--spineWidth);
		height: var(--bookHeight);
		flex-shrink: 0;
		transform-origin: right;
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
		margin-top: 12px;
		font-size: 12px;
		font-family: 'DM Sans', sans-serif;
		writing-mode: vertical-rl;
		user-select: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-height: calc(var(--height)-24 * 1px);
	}

	.coverContainer {
		display: flex;
		position: relative;
		flex-shrink: 0;
		overflow: hidden;
		transform-origin: left;
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
