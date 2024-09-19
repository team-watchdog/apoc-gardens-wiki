var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
	coll[i].addEventListener("click", function () {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.display === "block") {
			content.style.display = "none";
		} else {
			content.style.display = "block";
		}
	});
}

var info = document.getElementsByClassName("companion-info");

for (var i = 0; i < info.length; i++) {
	/** When mouse over */
	info[i].addEventListener("mouseover", function () {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.display === "block") {
			content.style.display = "none";
		} else {
			content.style.display = "block";
		}
	});

	/** When mouse out */
	info[i].addEventListener("mouseout", function () {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.display === "block") {
			content.style.display = "none";
		} else {
			content.style.display = "block";
		}
	});
}

/** Toggling header section categories */
document.querySelectorAll("#header-section button").forEach((button) => {
	button.addEventListener("click", () => {
		const list = button.nextElementSibling;
		list.classList.toggle("show");
		button.classList.toggle("active");

		let toggleIcon = button.querySelector("i");

		if (list.classList.contains("show")) {
			toggleIcon.classList.remove("fa-plus");
			toggleIcon.classList.add("fa-minus");
		} else {
			toggleIcon.classList.remove("fa-minus");
			toggleIcon.classList.add("fa-plus");
		}
	});
});
