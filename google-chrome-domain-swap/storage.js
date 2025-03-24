import { DomainSet } from './domain-sets.js';

var Storage = {
	store: function (sets) {
		chrome.storage.local.set({domain_sets: sets});
	},

	load: async function () {
		var result = await chrome.storage.local.get(["domain_sets"]);
		if (!result || !result.domain_sets) {
			return [];
		}
		return result.domain_sets;
	}
};

export { Storage };