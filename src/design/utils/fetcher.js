export class RequestError extends Error {
	constructor(message, { response='', status, headers={} }) {
		super(message);
		this.response = response;
		this.status = status;
		this.headers = headers;
	}
}

class Fetcher {
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
			console.warn('');
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

	request({ method, url='', path='/', headers={}, query={}, data, auth=true }) {
		let querystring = this.stringify(query);
		let computed_url = url || `${this.endpoint}${path}${querystring}`;

		if(this.token && !headers['Authorization'] && auth) {
			headers['Authorization'] = `Bearer ${this.token}`;
		}

		if(data && !headers['Content-Type']) {
			if(!(data instanceof FormData)) {
				headers['Content-Type'] = 'application/json';
			}
		}

		if(data instanceof Object && !(data instanceof FormData)) {
			data = JSON.stringify(data);
		}

		return fetch(computed_url, {
			method,
			headers,
			body: data
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
		})
	}
}

let fetcher = new Fetcher();

export default fetcher;
