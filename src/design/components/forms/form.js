import React from 'react';

function add_key_to_data(key, value, data={}) {
	if(!key) {
		// For some reason cehckboxes are valued '' when true
		return value;
	}

	const [ root, ...rest ] = key.split('.');
	const rest_key = rest.join('.');

	const unfixed_root = root.replace(/\[\d+\]$/, '');
	// || {} because match can return null
	const { groups: { index }={}} = root.match(/\[(?<index>\d+)\]/) || {};

	const _index = index ? Number.parseInt(index) : undefined;

	// Take data that'll match the location of the "next" value
	// This could be:
	// - nothing (does not exist yet)
	// - an object
	// - an array of values (which can be objects)
	const current_data = [undefined, null].includes(_index) ? data[unfixed_root] : data[unfixed_root]?.[_index];

	const next = add_key_to_data(rest_key, value, current_data || {});

	// If the key needs to be an array
	if(/\[\d+\]$/.test(root)) {

		// in case array does not exist
		data[unfixed_root] = data[unfixed_root] || [];
		data[unfixed_root][_index] = next;

		return data;
	}

	// Apply normal data
	data[root] = next;
	return data;
}

export function get_form_data(entries) {
	return entries.reduce((final_data, [key, value]) => {
		return add_key_to_data(key, value, final_data);
	}, {});
}

export const Form = React.forwardRef(({ onSubmit, children, ...rest }, ref) => {
	const preventSubmitProxy = React.useCallback((e) => {
		e.preventDefault();
		const data = new FormData(e.target);

		const form_data = get_form_data([...data.entries()]);
		return onSubmit(e, form_data);
	}, [onSubmit]);

	return (
		<form ref={ref} action="#" onSubmit={preventSubmitProxy} {...rest}>
			{ children }
		</form>
	);
});
