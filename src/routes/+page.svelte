<script lang="ts">
	import Bookshelf from '../components/bookshelf.svelte';
	import data from '$lib/goodreads.csv?raw';

	let bookData = data;

	const handleFileSelect = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) {
			return;
		}

		const file = input.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result;
			if (typeof text === 'string') {
				bookData = text;
			}
		};
		reader.readAsText(file);
	};
</script>

<svelte:head>
	<link
		rel="icon"
		href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>"
	/>
	<title>Bookshelf</title>
</svelte:head>

<h1>My Bookshelf</h1>

<input id="fileSelect" type="file" accept=".csv" on:change={handleFileSelect} />

<p>
	To download your Goodreads data, sign in and navigate to <a
		href="https://www.goodreads.com/review/import"
		target="_blank">here</a
	>. Click "export library" and upload the resulting CSV file.
</p>

<Bookshelf {bookData} />
