async function load () {
	var result = await chrome.storage.local.get(["domain_sets"]);
	if (!result || !result.domain_sets) {
		return [];
	}
	return result.domain_sets;
}

function getHostname( tab ) {
	return tab.url.split('/')[2];
}

function getCurrentSet( sets, hostname ) {
	var found_set;

	sets.forEach(function (set, set_i) {
		set.domains.forEach(function (domain, domain_i) {
			if( hostname === domain ) {
				found_set = set;
				return false;
			}
		});

		if( found_set ) {
			return false;
		}
	});

	return found_set;
}

async function setup_popup() {
	var sets = await load();
	if( sets.length === 0 ) {
		document.querySelector('#message').textContent = 'No Domain Sets Defined';
	}
	else {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs){
			var tab = tabs[0];
			var hostname = getHostname( tab );
			var found_set = getCurrentSet(sets, hostname);

			if( found_set ) {
				document.querySelector('#message').textContent = found_set.name;
				found_set.domains.forEach(function(domain, i) {
					if( hostname !== domain ) {
						var template = '<li><a href="#" data-domain="' + domain + '">' + domain + '</a></li>';
						document.querySelector('#options').innerHTML += template;
					}
				});
				var links = document.querySelectorAll('a');
				for (var i = 0; i < links.length; i++) {
					links[i].addEventListener('click', function (e) {
						var newDomain = this.dataset.domain;
						var newUrl = tab.url.replace(hostname, newDomain);

						chrome.tabs.update(tab.id, {url: newUrl});
						window.close();
					});
				}
			}
			else {
				document.querySelector('#message').textContent = 'No set for: ' + hostname;
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', async function () { setup_popup(); });