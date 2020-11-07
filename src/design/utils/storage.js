export class Storage {
	constructor({ prefix='' }={}) {
		this.prefix = prefix;
	}

	stringify(data) {
		let obj = { data };
		if(typeof data === 'string') {
			obj['type'] = 'string';
		}

		if(data instanceof Object) {
			obj['type'] = 'object';
		}

		return JSON.stringify(obj);
	}

	parse(data) {
		if(!data) {
			return null;
		}

		try {
			let parsed_data = JSON.parse(data);
			if(!parsed_data.type) {
				return parsed_data;
			}

			if(parsed_data.type === 'string') {
				return parsed_data.data;
			}

			if(parsed_data.type === 'object') {
				return JSON.parse(parsed_data.data);
			}
		} catch(e) {
			console.error(e);
			return data;
		}
	}

	get_key(key) {
		return `${this.prefix}${key}`;
	}

	store(key, data={}) {
		let obj = this.stringify(data);
		window.localStorage.setItem(this.get_key(key), obj);
	}

	get(key) {
		let data = window.localStorage.getItem(this.get_key(key));
		return this.parse(data);
	}

	remove(key) {
		window.localStorage.removeItem(this.get_key(key));
	}
}

const storage = new Storage();
export default storage;
