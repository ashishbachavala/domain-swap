import { DomainSwitcher } from './domain-switcher.js';

async function checkForDomainSet(tabId, changeInfo, tab) {
	var activeSet = await DomainSwitcher.getCurrentSet( tab );

	if( activeSet ) {
		chrome.action.setPopup({
			tabId: tabId,
			popup: "popup.html"
		});
		// if( activeSet.domains.length > 2 ) {
		// 	chrome.action.setPopup({
		// 		tabId: tabId,
		// 		popup: "popup.html"
		// 	});
		// } else {
		// 	chrome.action.onClicked.addListener(function( tab ) {
		// 		var hostname = DomainSwitcher.getHostname( tab );
		// 		var set = DomainSwitcher.getCurrentSet( tab );

		// 		set.domains.forEach(function(domain, i) {
		// 			if( hostname !== domain ) {
		// 				var newUrl = tab.url.replace(hostname, domain);

		// 				chrome.tabs.update(tab.id, {url: newUrl});
		// 				return false;
		// 			}
		// 		});
		// 	});
		// }
	}
}

chrome.tabs.onUpdated.addListener( checkForDomainSet );