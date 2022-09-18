import React from 'react';

export function useCopy() {
	return React.useCallback((value) => {
		if(typeof value === 'string') {
			return navigator.clipboard.writeText(value);
		}

		// No checks
		return navigator.clipboard.write(value);
	});
};
