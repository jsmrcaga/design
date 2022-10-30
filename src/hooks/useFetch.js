import React from 'react';
import fetcher from '../fetcher';

export function useFetch(url, { method, body, headers, auth=true, clear=false, launch=true, ssr=false }={}, deps=[]) {
	const [ response, setResponse ] = React.useState(null);
	const [ error, setError ] = React.useState(null);
	const [ loading, setLoading ] = React.useState(false);

	const fetch = React.useCallback((params={}) => {
		if(clear || params.clear) {
			setResponse(null);
		}

		const abortController = new AbortController();

		setLoading(true);
		setError(null);
		const request = fetcher.request({
			url,
			method,
			body,
			headers,
			auth,
			fetchOptions: {
				signal: abortController.signal
			},
			...params
		}).then(response => {
			setResponse(response);
			return response
		}).catch(e => {
			setError(e);
			throw e;
		}).finally(() => {
			setLoading(false);
		});

		return {
			request,
			abortController
		};
	}, deps);

	React.useEffect(() => {
		if(!globalThis.window && !ssr) {
			return () => {};
		}

		let abortController = null;
		if(launch) {
			const { abortController: ac, request } = fetch();
			request.catch(e => {
				// do nothing, request was done via hook so no request exists for developer
			});
			abortController = ac;
		}

		return () => {
			if(abortController) {
				abortController.abort();
			}
		};
	}, [fetch, launch, ssr]);

	return [ response, loading, error, fetch ];
}
