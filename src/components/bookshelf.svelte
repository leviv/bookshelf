<script lang="ts">
	import Papa from 'papaparse';
	import type { Book } from './bookTypes.js';
	import BookItem from './bookItem.svelte';

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

	$: errors = parsedData.errors;

	// Process books reactively when parsedData changes
	$: books = (() => {
		if (!parsedData.data) return [];

		let filteredBooks = parsedData.data
			// Filter by only read books
			.filter((book: Book) => book['Read Count'] > 0)
			// Filter by only books with reviews
			.filter((book: Book) => book['My Review']);

		// Sort by date read, most recent first
		filteredBooks.sort((a, b) => {
			const dateA = new Date(a['Date Read'] || a['Date Added'] || '');
			const dateB = new Date(b['Date Read'] || b['Date Added'] || '');
			return dateB.getTime() - dateA.getTime();
		});

		return filteredBooks;
	})();

	// Filter by only read books
	books = books.filter((book) => book['Read Count'] > 0);

	// Filter by only books with reviews
	books = books.filter((book) => book['My Review']);

	// Sort by date read, most recent first
	books.sort((a, b) => {
		const dateA = new Date(a['Date Read'] || a['Date Added'] || '');
		const dateB = new Date(b['Date Read'] || b['Date Added'] || '');
		return dateB.getTime() - dateA.getTime();
	});

	if (errors.length) {
		console.log('errors', errors);
	}

	let currentBookIndex = -1;
	const width = 41.5;
	const bookWidth = width * 5;

	$: book = currentBookIndex !== -1 ? books[currentBookIndex] : null;
	$: review = (() => {
		if (!book) return '';

		const reviewText = book['My Review'] || '';
		return reviewText.replace(/\n/g, '<br/>');
	})();
	$: reviewDate = (() => {
		if (!book) return '';

		const dateStr = book['Date Read'] || book['Date Added'];
		if (!dateStr) {
			return 'N/A';
		}
		const date = new Date(dateStr);
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	})();
	$: bookTitle = book ? book.Title : '';

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
				? getSpineWidth(book) * 5
				: getSpineWidth(book)}px;"
		>
			<BookItem {book} {index} {currentBookIndex} />
		</button>
	{/each}
</div>

{#if currentBookIndex !== -1 && book}
	<hr />
	<div class="review">
		<h2>My review of {bookTitle}</h2>
		<h4>Reviewed on {reviewDate}</h4>
		<p>My rating: {book['My Rating']} / 5</p>
		<p>Average rating: {book['Average Rating']} / 5</p>
		<p>{@html review}</p>
	</div>
{/if}

<style>
	.bookshelf {
		display: flex;
		gap: 8px;
		overflow-x: scroll;
		padding-bottom: 16px;
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

	.review {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 16px;
	}

	.review h2 {
		font-family: 'Yeseva One', serif;
	}
</style>
