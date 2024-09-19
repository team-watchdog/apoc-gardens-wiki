function fitToHtmlTemplate(content) {
	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
		<link href="./output.css" rel="stylesheet" />

		<!-- Font Awesome -->
		<link href="/src/assets/fontawesome/css/fontawesome.css" rel="stylesheet" />
		<link href="/src/assets/fontawesome/css/brands.css" rel="stylesheet" />
		<link href="/src/assets/fontawesome/css/solid.css" rel="stylesheet" />

		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

		<!-- Google Fonts -->
		<link
			href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
			rel="stylesheet" />
	</head>
	<body>
		<!-- HEADER SECTION -->
		<nav id="header-section">
			<h2>Content</h2>
			<div>
				<ul>
					<li><a href="#">Flowers</a></li>
					<li><a href="#">Fruit</a></li>
					<li><a href="#">Herbs & Spices</a></li>
					<li><a href="#">Leafy Greens</a></li>
					<li><a href="#">Roots</a></li>
					<li><a href="#">Vegetables</a></li>
				</ul>
			</div>
		</nav>

		<!-- MAIN SECTION -->
		<article id="main-section">
			<section id="description-section">
				<!-- Description-->
				<h1>Description</h1>
				<hr />
				
				<br />
			</section>
			<!-- Plant requirements -->
			<section id="plant-requirements-section">
				<h1>Plant requirements</h1>
				<hr />
				${content}
				
			</section>
			<br />
			<!-- Harvesting -->
			<section id="harvesting-section">
				<h1>Harvesting</h1>
				<hr />
				
			</section>
			<br />
			<!-- Curing -->
			<section id="curing-section">
				<h1>Curing</h1>
				<hr />
				
			</section>
			<br />

			<!-- Storage -->
			<section id="storage-section">
				<h1>Storage</h1>
				<hr />
				
			</section>
			<br />

			<!-- Protecting your plants -->
			<section id="protecting-plant-section">
				<h1>Protecting your plants</h1>
				<hr />
				
			</section>
			<br />
		</article>

		<!-- This is the general information section -->
		<article id="general-information-section">
			<img src="assets/images/beetroot.png" alt="placeholder" />
			<div class="info-container">
				<h1></h1>
				<div id="general-info">
				</div>
				<hr />
				<!-- Difficulty Rating -->
				<div id="difficulty-rating">
					<h2>Difficulty rating</h2>
					<div class="difficulty-container">
						<div class="difficulty-item-container">
							<div class="overview collapsible">
								<p class="font-bold">Low country wet zone</p>
								<p class="difficulty-tag">Difficulty:</p>
								<p class="stars"></p>
							</div>
							<div class="content"></div>
						</div>

						<div class="difficulty-item-container">
							<div class="overview collapsible">
								<p class="font-bold">Low country dry zone</p>
								<p class="difficulty-tag">Difficulty:</p>
								<p class="stars"></p>
							</div>
							<div class="content"></div>
						</div>
						<div class="difficulty-item-container">
							<div class="overview collapsible">
								<p class="font-bold">Mid country</p>
								<p class="difficulty-tag">Difficulty:</p>
								<p class="stars"></p>
							</div>
							<div class="content"></div>
						</div>
						<div class="difficulty-item-container">
							<div class="overview collapsible">
								<p class="font-bold">Up country</p>
								<p class="difficulty-tag">Difficulty:</p>
								<p class="stars"></p>
							</div>
							<div class="content"></div>
						</div>
					</div>
				</div>
				<hr />
				<div id="companion-plants" class="relative">
					<div class="flex gap-x-2">
						<h2>Companion plants</h2>
						<button class="companion-info">
							<i
								class="fa-regular fa-circle-question text-primary-700 text-sm"></i>
						</button>
						<p class="companion-definition">
							Companion plants aid growth by attracting beneficial insects,
							repelling pests, and providing support. They are part of a natural
							pest control system, maximising space and increasing crop
							productivity.
						</p>
					</div>
					<ul></ul>
				</div>

				<div id="non-companion-plants" class="relative">
					<div class="flex gap-x-2">
						<h2>Non-companion plants</h2>
						<button class="companion-info">
							<i
								class="fa-regular fa-circle-question text-secondary-900 text-sm"></i>
						</button>
						<p class="companion-definition">
							Non-companion plants are those that negatively affect each other’s
							growth when planted together, often due to competition for
							resources or chemical interference. Avoiding these pairings helps
							improve plant health and yields.
						</p>
					</div>
					<ul></ul>
				</div>
			</div>
		</article>
		<script src="https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js"></script>
		<script src="./output.js"></script>
	</body>
</html>`;
}

module.exports = fitToHtmlTemplate;
