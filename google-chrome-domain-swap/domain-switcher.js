import { Storage } from './storage.js';

var DomainSwitcher = {
	getHostname: function( tab ) {
		return tab.url.split('/')[2];
	},
	getCurrentSet: async function( tab ) {
		var found_set;
		var sets = await Storage.load();
		var hostname = DomainSwitcher.getHostname( tab );

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
};

export { DomainSwitcher };