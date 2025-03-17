import { DomainSet } from './domain-sets.js';

var Storage = {
	store: function (sets) {
		chrome.storage.local.set({domain_sets: sets});
		// localStorage.domain_sets = JSON.stringify(sets);
	},

	load: async function () {
		var sets = {};
		var result = await chrome.storage.local.get(["domain_sets"]);
		if (!result || !result.domain_sets) {
			return [];
		}
		// for (var i in result.domain_sets) {
		// 	sets[i] = result.domain_sets[i];
		// }
		return result.domain_sets;
		// var sets = localStorage.domain_sets;
		// console.log(sets);
		var result = [];
		if( ! sets ) { return result; }
		// sets = JSON.parse(sets);
		for( var i in sets ) {
			result.push(new DomainSet(sets[i].name, sets[i].domains));
			// sets[i] = new DomainSet(sets[i].name, sets[i].domains);
		}
		return result;
	}
};

export { Storage };