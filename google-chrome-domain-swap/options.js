/**
 * Show a message next to the form actions.
 *
 * TODO: This is a bit dodgy, we need a better notification system.
 */
function flash_message (message) {
	document.querySelector('#message').innerText = message;
	setTimeout(function () { document.querySelector('#message').innerText = ''; }, 2500);
}

/**
 * add_domain_set and save_sets make some assumptions about the template for domain sets.
 * If you modify the template, keep these assumptions in mind:
 *
 * 1) There is only one input, and it contains the name.
 * 2) There is only one textarea, and it contains the domains, one to a line.
 * 3) There is a delete button, whose parent is the container form.
 */

/**
 * Append a new domain set from a template to the target, optionally 
 * pre-filling it with data from a DomainSet object.
 */
function add_domain_set (target, template, set) {
	var tmp_div = document.createElement('div');
	tmp_div.innerHTML = template.textContent;
	if( 'undefined' !== typeof set ) {
		tmp_div.querySelector('input').value = set.name;
		tmp_div.querySelector('textarea').value = set.domains.join("\n");
	}
	tmp_div.querySelector('button.delete_set').addEventListener('click', function (e) { e.preventDefault(); mp.track('domain_set_deleted'); this.parentNode.remove(); });
	target.appendChild(tmp_div.querySelector('form'));
}

/**
 * Extract and save the DomainSet data from a NodeList of forms.
 */
function save_sets (forms) {
	var i, form, sets = [];
	for (i = 0; i < forms.length; ++i) {
		form = forms[i];
		domainSet = {
			name: form.querySelector('input').value || "",
			domains: form.querySelector('textarea').value.split("\n")
		}
		sets.push(domainSet);
	}
	chrome.storage.local.set({domain_sets: sets});
	mp.track('domain_set_saved', { set_count: sets.length });
	flash_message('Saved!');
}

async function load () {
	var result = await chrome.storage.local.get(["domain_sets"]);
	if (!result || !result.domain_sets) {
		return [];
	}
	return result.domain_sets;
}

/**
 * Load DomainSets from storage and add their forms to the document.
 */
async function restore_sets (target, template) {
	var sets = await load();
	sets.forEach(function (set, set_i) {
		add_domain_set(target, template, set);
	});
}

document.addEventListener('DOMContentLoaded', async function () { restore_sets(document.querySelector('#domain_sets'), document.querySelector('#domain_set_template')); });
document.querySelector('#save').addEventListener('click', function (e) { e.preventDefault(); save_sets(document.querySelectorAll('#domain_sets form')); });
document.querySelector('#add_set').addEventListener('click', function (e) { e.preventDefault(); mp.track('domain_set_added'); add_domain_set(document.querySelector('#domain_sets'), document.querySelector('#domain_set_template')); });
