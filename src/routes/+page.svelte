<script lang="ts">
	import Bookshelf from '../components/bookshelf.svelte';
	import data from '$lib/goodreads.csv?raw';

	let bookData = data;

	function handleFileSelect(event: Event) {
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
	}
</script>

<svelte:head>
	<link
		rel="icon"
		href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Yeseva+One&display=swap"
		rel="stylesheet"
	/>
	<title>Bookshelf</title>
</svelte:head>

<div class="content">
	<div class="header">
		<h1 class="pageTitle">My Bookshelf</h1>
		<input
			id="fileSelect"
			class="fileInput"
			type="file"
			accept=".csv"
			on:change={handleFileSelect}
		/>

		<p>
			To download your Goodreads data, sign in and navigate <a
				href="https://www.goodreads.com/review/import"
				target="_blank">here</a
			>. Click "export library" and upload the resulting CSV file.
		</p>
	</div>

	<Bookshelf {bookData} />

	<footer>
		Made with ❤️ by <a href="https://leviv.cool" target="_blank">Levi</a> &copy; 2025
	</footer>
</div>

<style>
	.content {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Josefin Sans', sans-serif;
	}

	.header {
		max-width: 800px;
		margin: 0 auto;
		padding: 16px;
	}

	.pageTitle {
		font-family: 'Yeseva One', serif;
	}

	.fileInput {
		cursor: pointer;
	}

	.fileInput::file-selector-button {
		padding: 5px 10px;
		border-radius: 15px;
		background-color: #fff;
		cursor: pointer;
	}

	footer {
		width: 800px;
		margin-right: auto;
		margin-left: auto;
		margin-top: auto;
		padding: 30px 0 30px 16px;
	}
</style>
