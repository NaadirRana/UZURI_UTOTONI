document.addEventListener('DOMContentLoaded', function () {
	var forms = document.querySelectorAll('form[data-endpoint]');

	forms.forEach(function (form) {
		form.addEventListener('submit', function (event) {
			event.preventDefault();
			var endpoint = form.getAttribute('data-endpoint') || 'backend endpoint';
			window.alert('Form captured on frontend. Backend integration pending for: ' + endpoint);
		});
	});
});
