class JWTException extends Error {}

class JWT {
	constructor({ alg='', payload={}, signature=null}) {
		this.alg = alg;
		this.payload = payload;
		this.signature = signature;
	}

	static parse(token, { public_key='' }={}) {
		let [ alg, payload, sign ] = token.split('.');
		alg = JSON.parse(atob(alg));
		payload = JSON.parse(atob(payload));
		let jwt = new this({ alg, payload, sign });

		if(public_key) {
			jwt.verify({ public_key });
		}

		return jwt;
	}

	verify({ public_key='' }={}) {
		let { exp } = this.payload;
		// TODO: put time in seconds
		if(exp && exp < Date.now()) {
			throw new JWTException('Token expired');
		}

		return true;
	}

	validate() {
		return this.verify.call(this, arguments);
	}
}

export default JWT;
