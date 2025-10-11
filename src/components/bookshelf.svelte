<script lang="ts">
	import Papa from 'papaparse';
	import type { Book } from './bookTypes.js';
	import BookItem from './bookItem.svelte';
	import BookReview from './bookReview.svelte';
	import { getBookWidth } from '$lib/utils.js';

	export let bookData: string;

	let { data: books, errors } = Papa.parse<Book>(bookData, {
		header: true,
		skipEmptyLines: true,
		dynamicTyping: true
	});

	// Make the parsing reactive to bookData changes
	$: parsedData = Papa.parse<Book>(bookData, {
		header: true,
		skipEmptyLines: true,
		dynamicTyping: true
	});

	if (errors.length > 0) {
		console.log(errors);
	}

	// Process books reactively when parsedData changes
	$: books = (() => {
		if (!parsedData.data) return [];

		let filteredBooks = parsedData.data
			.filter((book: Book) => book['Read Count'] > 0)
			.filter((book: Book) => book['My Review']);

		// Sort by date read, most recent first
		filteredBooks.sort((a, b) => {
			const dateA = new Date(a['Date Read'] || a['Date Added'] || '');
			const dateB = new Date(b['Date Read'] || b['Date Added'] || '');
			return dateB.getTime() - dateA.getTime();
		});

		return filteredBooks;
	})();

	let currentBookIndex = -1;

	$: book = currentBookIndex !== -1 ? books[currentBookIndex] : null;

	$: bookClicked = (index: number) => {
		currentBookIndex = index === currentBookIndex ? -1 : index;
	};
</script>

<div class="bookshelf-container">
	<div class="bookshelf">
		{#each books as book, index}
			<button
				class="book"
				on:click={() => bookClicked(index)}
				style="--width:{getBookWidth(book['Number of Pages'], currentBookIndex === index)}px;"
			>
				<BookItem {book} {index} {currentBookIndex} />
			</button>
		{/each}
	</div>
</div>

{#if currentBookIndex !== -1 && book}
	<BookReview {book} />
{/if}

<style>
	.bookshelf-container {
		width: 100%;
		display: flex;
		justify-content: center;
		overflow-x: scroll;
	}

	.bookshelf {
		display: flex;
		padding: 0px 8px 16px 8px;
		gap: 8px;
		overflow-x: hidden;
		padding-bottom: 16px;
	}

	.book {
		padding: 0;
		width: var(--width);
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
	}
</style>
