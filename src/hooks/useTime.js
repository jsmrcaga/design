import React from 'react';

export function useDebounce(callback, timeout_ms=200, deps=[callback, timeout_ms]) {
	const _timeout = React.useRef(null);

	const debounced = React.useCallback((...args) => {
		clearTimeout(_timeout.current);
		_timeout.current = setTimeout(() => {
			callback(...args);
		}, timeout_ms);
	}, deps);

	const cancel = React.useCallback(() => {
		clearTimeout(_timeout.current);
	}, [_timeout]);

	return [debounced, cancel];
}

export function useThrottle(callback, once_every_ms=50) {
	const is_throttled = React.useRef(false);

	const throttled = React.useCallback((...args) => {
		if(is_throttled.current) {
			return;
		}

		// Block the rest
		is_throttled.current = true;
		// Launch ours, in that order
		callback(...args);

		setTimeout(() => {
			is_throttled.current = false;
		}, once_every_ms);
	}, [callback, once_every_ms, is_throttled]);

	return throttled;
}

export function useInterval(callback, delay_ms, deps=[callback, delay_ms]) {
	React.useEffect(() => {
		if(!delay_ms) {
			return;
		}

		const interval = setInterval(callback, delay_ms);

		return () => {
			clearInterval(interval);
		};
	}, deps);
}
