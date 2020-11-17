if (document.getElementsByClassName("validate-form").length > 0) {
	const form = document.getElementsByClassName("validate-form")[0];
	const buttonSubmit = document.getElementById("buttonSubmit");

	buttonSubmit.addEventListener("click", (e) => {
		validateForm(e);
	});

	const validateForm = (e) => {
		validateRequired(e);
	};

	const validateRequired = (e) => {
		let fields = document.getElementsByClassName("field-required");

		for (let field of fields) {
			let parent = field.parentNode;
			let error = parent.childNodes[5];
			field.classList.remove("border-danger");
			error.classList.remove("d-block");
			error.classList.add("d-none");
		}

		for (let field of fields) {
			if (field.value.trim() === "") {
				let parent = field.parentNode;
				let error = parent.childNodes[5];
				field.classList.add("border-danger");
				error.classList.remove("d-none");
				error.classList.add("d-block");
				e.preventDefault();
			}
		}
	};
}
