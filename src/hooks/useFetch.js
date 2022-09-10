import React from 'react';
import fetcher from '../fetcher';

export function useFetch(url, { method, body, headers, auth=true, clear=false, launch=true }, deps=[]) {
	const [ response, setResponse ] = React.useState(null);
	const [ error, setError ] = React.useState(null);
	const [ loading, setLoading ] = React.useState(false);

	const fetch = React.useCallback((params) => {
		if(clear || params.clear) {
			setResponse(null);
		}

		setLoading(true);
		setError(null);
		return fetcher.request({
			url,
			method,
			body,
			headers,
			auth,
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
	}, deps);

	React.useEffect(() => {
		if(!launch) {
			return;
		}

		return fetch();
	}, [fetch, launch]);

	return [ response, loading, error, fetch ];
}
