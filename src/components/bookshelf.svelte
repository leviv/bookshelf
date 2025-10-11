<script lang="ts">
	import Papa from 'papaparse';
	import type { Book } from './bookTypes.js';
	import BookItem from './bookItem.svelte';
	import BookReview from './bookReview.svelte';

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
	const width = 41.5;

	$: book = currentBookIndex !== -1 ? books[currentBookIndex] : null;

	$: bookClicked = (index: number) => {
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
			style="--width:{currentBookIndex === index
				? getSpineWidth(book) + 150
				: getSpineWidth(book)}px;"
		>
			<BookItem {book} {index} {currentBookIndex} />
		</button>
	{/each}
</div>

{#if currentBookIndex !== -1 && book}
	<BookReview {book} />
{/if}

<style>
	.bookshelf {
		display: flex;
		gap: 8px;
		overflow-x: scroll;
		padding-bottom: 16px;
	}

	.book {
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
