<script lang="ts">
	import type { Book } from './bookTypes';

	export let book: Book;

	function getReviewDate(book: Book) {
		// Sometimes the user doesn't specify a read date
		// fall back to the added date which should always exist
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
	}

	function getReview(book: Book) {
		const reviewText = book['My Review'] || '';
		return reviewText.replace(/\n/g, '<br/>');
	}
</script>

<hr />
<div class="review">
	<h2>My review of {book.Title}</h2>
	<h4>Reviewed on {getReviewDate(book)}</h4>
	<p>My rating: {book['My Rating']} / 5</p>
	<p>Average rating: {book['Average Rating']} / 5</p>
	<p>{@html getReview(book)}</p>
</div>

<style>
	.review {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 16px;
	}

	.review h2 {
		font-family: 'Yeseva One', serif;
	}

	hr {
		width: 90%;
	}
</style>
