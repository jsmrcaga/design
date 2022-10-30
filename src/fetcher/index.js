export class RequestError extends Error {
	constructor(message, { response='', status, headers={} }) {
		super(message);
		this.response = response;
		this.status = status;
		this.headers = headers;
	}
}

export class Fetcher {
	constructor() {
		this.endpoint = null;
		this.token = null;
		this.events = {};
	}

	on(event, cb) {
		if(!this.events[event]) {
			this.events[event] = [];
		}

		this.events[event].push(cb);
	}

	emit(event, data) {
		if(!this.events[event]) {
			return;
		}

		for(let cb of this.events[event]) {
			cb(data);
		}
	}

	stringify(query={}) {
		let querystring = Object.entries(query).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
		querystring = querystring ? `?${querystring}` : '';
		return querystring;
	}

	request({ method, url='', path='/', headers={}, query={}, body, auth=true, fetchOptions={} }) {
		let querystring = this.stringify(query);
		let computed_url = url || `${this.endpoint}${path}${querystring}`;

		if(this.token && !headers['Authorization'] && auth) {
			headers['Authorization'] = `Bearer ${this.token}`;
		}

		if(body && !headers['Content-Type']) {
			if(!(body instanceof FormData)) {
				headers['Content-Type'] = 'application/json';
			}
		}

		if(body instanceof Object && !(body instanceof FormData)) {
			body = JSON.stringify(body);
		}

		return fetch(computed_url, {
			method,
			headers,
			body,
			...fetchOptions
		}).then(response => {
			if(response.status < 200 || response.status > 299) {
				return response.json().then(res => {
					let error = new RequestError('Could not fetch', {
						response: res,
						status: response.status,
						headers: response.headers
					});

					if(response.status === 403) {
						this.emit('unauthorized', error);
					}

					if(response.status === 404) {
						this.emit('not-found', error);
					}

					throw error;
				});
			}

			if(response.status === 204) {
				return;
			}

			return response.json();
		}).catch(e => {
			console.error(e);
			throw e;
		});
	}
}

let fetcher = new Fetcher();

export default fetcher;
