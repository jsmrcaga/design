import React from 'react';
import fetcher from '../fetcher';

export function useFetch(url, {
	method,
	body,
	headers,
	auth=true,
	clear=false,
	launch=true,
	ssr=false,
	onSuccess=null,
	onError=null
}={}, deps=[]) {
	const [ response, setResponse ] = React.useState(null);
	const [ error, setError ] = React.useState(null);
	const [ loading, setLoading ] = React.useState(launch);

	// This is a ref for 2 reasons
	// 1 - StrictMode in react launches useEffect twice really fast
	// 	   triggering the abort signal. THe 2nd time abort was already
	//     aborted so 2nd request could not even start
	// 2 - In a real world scenario, if a user abortes the request
	//     we need to reset the abort signal in case the user retriggers
	//     a request (wether changing deps or calling the fetch function)
	//     otherwise we have the same problem as 1/
	const abortController = React.useRef(new AbortController());

	const fetch = React.useCallback((params={}) => {
		if(clear || params.clear) {
			setResponse(null);
		}

		let lastLoading = null;
		setLoading(currentLoading => {
			// small hack to prevent "loading" dependency
			lastLoading = currentLoading;
			return true;
		});

		setError(null);

		return fetcher.request({
			url,
			method,
			body,
			headers,
			auth,
			fetchOptions: {
				signal: abortController.current.signal
			},
			...params
		}).then(response => {
			if(onSuccess) {
				onSuccess(response);
			}
			setResponse(response);
			setLoading(false);
			return response
		}).catch(e => {
			if(onError) {
				onError(e);
			}

			setError(e);
			// Allows user to ensure loading remains the same if there was an error
			// Set specifically to protect against react strict mode 2ble trigger
			// But useful in a real-world scenario
			setLoading(lastLoading);
			throw e;
		});
	}, [...deps, abortController]);

	React.useEffect(() => {
		if(!globalThis.window && !ssr) {
			return () => {};
		}

		if(launch) {
			fetch().catch(e => {
				// do nothing, request was done via hook so no request exists for developer
			});
		}

		return () => {
			if(abortController.current) {
				setLoading(launch);
				abortController.current.abort();
				// Reset to prevent blocking next requests
				abortController.current = new AbortController();
			}
		};
	}, [fetch, launch, ssr, abortController]);

	const abort = React.useCallback(() => {
		if(abortController.current) {
			// Abort and reset to prevent blocking next requests
			abortController.current.abort();
			abortController.current = new AbortController();
		}
	}, [abortController]);

	return [ response, loading, error, fetch, abort ];
}
