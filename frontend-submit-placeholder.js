document.addEventListener('DOMContentLoaded', function () {
	var forms = document.querySelectorAll('form[data-endpoint]');
	var appointmentForm = document.getElementById('appointment-booking-form');

	function formatDisplayDate(rawDate) {
		if (!rawDate) {
			return '';
		}

		var parsed = new Date(rawDate + 'T00:00:00');
		if (Number.isNaN(parsed.getTime())) {
			return rawDate;
		}

		return parsed.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function buildAppointmentItem(doctorClinic, dateText, timeSlot, detailsText) {
		var item = document.createElement('li');
		item.className = 'appointment-item';

		var header = document.createElement('div');
		header.className = 'appointment-item-header';
		header.textContent = doctorClinic;

		var meta = document.createElement('div');
		meta.className = 'appointment-item-meta';
		meta.textContent = dateText + ' at ' + timeSlot;

		var reason = document.createElement('div');
		reason.className = 'appointment-item-reason';
		reason.textContent = detailsText;

		item.appendChild(header);
		item.appendChild(meta);
		item.appendChild(reason);
		return item;
	}

	if (appointmentForm) {
		appointmentForm.addEventListener('submit', function (event) {
			event.preventDefault();

			var submitButton = appointmentForm.querySelector('button[type="submit"]');
			var feedbackBox = document.getElementById('appointment-feedback');
			var upcomingList = document.getElementById('upcoming-appointments');

			var infantInput = document.getElementById('infant_id');
			var doctorSelect = document.getElementById('doctor_id');
			var dateInput = document.getElementById('appointment_date');
			var timeInput = document.getElementById('appointment_time');
			var statusSelect = document.getElementById('status');

			if (!submitButton || !feedbackBox || !upcomingList || !infantInput || !doctorSelect || !dateInput || !timeInput || !statusSelect) {
				return;
			}

			var selectedInfantId = infantInput.value;
			var selectedDoctorId = doctorSelect.value;
			var selectedDoctorLabel = doctorSelect.options[doctorSelect.selectedIndex].text;
			var selectedDateRaw = dateInput.value;
			var selectedDate = formatDisplayDate(selectedDateRaw);
			var selectedTime = timeInput.value;
			var selectedStatus = statusSelect.value;

			submitButton.disabled = true;
			submitButton.classList.add('is-loading');
			submitButton.dataset.originalText = submitButton.textContent;
			submitButton.textContent = 'Checking availability...';

			setTimeout(function () {
				feedbackBox.hidden = false;
				feedbackBox.textContent = 'Appointment Confirmed for ' + selectedDate + ' at ' + selectedTime + '!';

				var emptyItem = upcomingList.querySelector('.appointment-empty');
				if (emptyItem) {
					emptyItem.remove();
				}

				var newItem = buildAppointmentItem(
					'infant_id: ' + selectedInfantId,
					selectedDate,
					selectedTime,
					'doctor_id: ' + selectedDoctorId + ' (' + selectedDoctorLabel + '), status: ' + selectedStatus
				);
				upcomingList.appendChild(newItem);

				appointmentForm.reset();

				submitButton.disabled = false;
				submitButton.classList.remove('is-loading');
				submitButton.textContent = submitButton.dataset.originalText || 'Book Appointment';
			}, 1000);
		});
	}

	forms.forEach(function (form) {
		form.addEventListener('submit', function (event) {
			if (form === appointmentForm) {
				return;
			}

			event.preventDefault();
			var endpoint = form.getAttribute('data-endpoint') || 'backend endpoint';
			window.alert('Form captured on frontend. Backend integration pending for: ' + endpoint);
		});
	});
});
