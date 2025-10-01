<script lang="ts">
	import data from '$lib/goodreads.csv?raw';
	import Papa from 'papaparse';
	import type { Book } from './bookTypes.js';
	import BookItem from './bookItem.svelte';

	const { data: books, errors } = Papa.parse<Book>(data, {
		header: true,
		skipEmptyLines: true,
		dynamicTyping: true
	});

	if (errors.length) {
		console.log('errors', errors);
	}

	let currentBookIndex = -1;
	const width = 41.5;
	const bookWidth = width * 5;

	$: bookClicked = (index: number) => {
		console.log('book clicked', index);
		currentBookIndex = index === currentBookIndex ? -1 : index;
		console.log('book', books[index]);
	};

	const getSpineWidth = (book: Book) => {
		const numPages = book['Number of Pages'] || 0;
		const minWidth = 15;
		return minWidth + numPages / 10;
	};
</script>

<div class="bookshelf">
	{#each books as book, index}
		<button
			class="book"
			on:click={() => bookClicked(index)}
			style="--width:{currentBookIndex === index ? bookWidth : getSpineWidth(book)}px;"
		>
			<BookItem {book} {index} {currentBookIndex} />
		</button>
	{/each}
</div>

<style>
	.bookshelf {
		display: flex;
		gap: 8px;
		overflow-x: scroll;
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
		transition: all 500ms ease;
		will-change: auto;
		width: var(--width);
	}
</style>
