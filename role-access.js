(function () {
	var ROLE_KEY = 'uzuri_user_role';

	var STAFF_PAGES = [
		'dashboard-hospital.html',
		'view-infants.html',
		'feeding-log.html',
		'vaccination-update.html',
		'growth-record.html',
		'monitor-infant.html',
		'diagnosis-record.html',
		'treatment-prescription.html',
		'procedure-log.html',
		'infant-assessment.html',
		'admin-user-management.html',
		'admin-audit-log.html',
		'admin-reports.html'
	];

	var ROLE_RULES = {
		'Nurse / Clinical Staff': [
			'dashboard-hospital.html',
			'view-infants.html',
			'feeding-log.html',
			'vaccination-update.html',
			'growth-record.html',
			'monitor-infant.html'
		],
		'Medical Doctor': [
			'dashboard-hospital.html',
			'view-infants.html',
			'monitor-infant.html',
			'diagnosis-record.html',
			'treatment-prescription.html',
			'procedure-log.html',
			'infant-assessment.html'
		],
		'System Administrator': [
			'dashboard-hospital.html',
			'admin-user-management.html',
			'admin-audit-log.html',
			'admin-reports.html'
		]
	};

	function currentFileName() {
		return (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
	}

	function linkPath(link) {
		var href = (link.getAttribute('href') || '').toLowerCase();
		if (!href) {
			return '';
		}
		if (href.charAt(0) === '#') {
			return currentFileName();
		}
		return href.split('#')[0] || '';
	}

	function saveRoleFromLogin() {
		if (currentFileName() !== 'login.html') {
			return;
		}

		var form = document.querySelector('form');
		var roleSelect = document.getElementById('user_role');
		if (!form || !roleSelect) {
			return;
		}

		form.addEventListener('submit', function () {
			if (roleSelect.value) {
				sessionStorage.setItem(ROLE_KEY, roleSelect.value);
			}
		});
	}

	function applyStaffRoleAccess() {
		var page = currentFileName();
		if (STAFF_PAGES.indexOf(page) === -1) {
			return;
		}

		var role = sessionStorage.getItem(ROLE_KEY);
		var allowedPages = role ? ROLE_RULES[role] : null;

		if (!allowedPages) {
			window.alert('Please log in and choose your access role first.');
			window.location.href = 'login.html';
			return;
		}

		if (allowedPages.indexOf(page) === -1) {
			window.alert('Access restricted: this page is not available for your role.');
			window.location.href = allowedPages[0];
			return;
		}

		var navLinks = document.querySelectorAll('.nav-links a[href]');
		navLinks.forEach(function (link) {
			var path = linkPath(link);
			if (!path) {
				return;
			}

			if (path === 'login.html') {
				return;
			}

			if (allowedPages.indexOf(path) === -1) {
				link.parentElement.style.display = 'none';
			}
		});
	}

	saveRoleFromLogin();
	applyStaffRoleAccess();
})();
