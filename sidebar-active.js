(function () {
	var nav = document.querySelector('.nav-links');
	if (!nav) {
		return;
	}

	var links = Array.prototype.slice.call(nav.querySelectorAll('a[href]'));
	if (!links.length) {
		return;
	}

	var currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'dashboard.html';
	var currentHash = (window.location.hash || '').toLowerCase();

	links.forEach(function (link) {
		link.classList.remove('active');
	});

	function normalizeHref(rawHref) {
		if (!rawHref) {
			return { path: '', hash: '' };
		}

		var href = rawHref.toLowerCase();
		if (href.charAt(0) === '#') {
			return { path: 'dashboard.html', hash: href };
		}

		var parts = href.split('#');
		return {
			path: parts[0] || '',
			hash: parts[1] ? '#' + parts[1] : ''
		};
	}

	var activeLink = null;

	links.forEach(function (link) {
		var normalized = normalizeHref(link.getAttribute('href'));
		if (!normalized.path) {
			return;
		}

		if (normalized.path === currentPath && normalized.hash && normalized.hash === currentHash) {
			activeLink = link;
		}
	});

	if (!activeLink) {
		links.forEach(function (link) {
			var normalized = normalizeHref(link.getAttribute('href'));
			if (normalized.path === currentPath && !normalized.hash) {
				activeLink = link;
			}
		});
	}

	if (!activeLink && currentPath === 'dashboard.html') {
		activeLink = links.find(function (link) {
			return normalizeHref(link.getAttribute('href')).path === 'dashboard.html';
		}) || null;
	}

	if (activeLink) {
		activeLink.classList.add('active');
	}
})();
