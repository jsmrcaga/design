import React from 'react';

import { useInterval } from './useTime';

export function useLocalStorageChange(mutation, comparison, keys) {
	const oldItems = React.useRef({});

	if(Array.isArray(comparison) && !keys) {
		keys = comparison;
		comparison = null;
	}

	useInterval(() => {
		// compare all keys and 
		for(const key of keys) {
			const newItem = localStorage.getItem(key);
			if(!comparison(newItem, oldItems.current[key])) {
				callback(newItem, oldItems.current[key]);
			}

			// Update old items once we're good
			oldItems.current[key] = newItem;
		}
	}, 50, [keys, comparison]);
}
