import React from 'react';

const Validators = {
	required: ({ value, type }, next) => {
		switch(type) {
			case 'string':
				if(!value) {
					return next('required');
				}
				break;
			case 'bool':
				if(value !== true && value !== false) {
					return next('required');
				}
				break;
			case 'checkbox':
				if(value !== true) {
					return next('required');
				}
				break;
			default:
				if(value === undefined) {
					return next('required');
				}
		}

		return next();
	},
	number: ({ min=-Infinity, max=Infinity, value='' }) => {
		if(value < min) {
			return 'min';
		}

		if(value > max) {
			return 'max'
		}

		return true;
	},

	int: ({ value='', ...rest }) => {
		let number = this.number({ value, ...rest });
		if(number !== true) {
			return number;
		}

		let floor = Math.floor(value);
		if(value > floor) {
			return 'int';
		}

		return true;
	},

	float: (...args) => {
		let number = this.number(...args);
		if(number !== true) {
			return number;
		}

		return true;
	},

	string:({ min=-Infinity, max=Infinity, value, pattern, flags }) => {
		if(!value) {
			value = '';
		}

		if(value.length < min) {
			return 'min';
		}

		if(value.length > max) {
			return 'max';
		}

		if(pattern) {
			let regex = new RegExp(pattern, flags);
			if(!regex.test(value)) {
				return 'pattern';
			}
		}

		return true;
	},

	bool: ({ value='' }) => {
		return true;
	}
};

// Run all validators with nextable properties
function run_validators(validators, params) {
	let timeout = null;

	function next(error=null, index=0) {
		clearTimeout(timeout);

		if(error) {
			return error;
		}

		if(!validators[index]) {
			return true;
		}

		const validator = validators[index];
		if(validator.length > 1) {
			timeout = setTimeout(() => {
				throw new Error(`[useForm] Next was declared but not called in validator ${validator.name}`);
			}, 2000);
			return validator(params, (error) => next(error, index + 1));
		}

		// Error
		let valid = validator(params);
		if(typeof valid === 'string') {
			return valid;
		}

		// Continue
		if(validators[index+1]) {
			return next(null, index + 1);
		}

		// No more validators and no error
		return true;
	}

	let ret = next();
	return ret;
}

// Get all validators for a single input
function get_validators({ validators=[], validator, type, required }) {
	if(required) {
		validators.push(Validators.required);
	}

	if(Validators[type]) {
		validators.push(Validators[type]);
	}

	if(validator) {
		validators.push(validator);
	}

	return validators;
}

export function useForm(spec={}, { autovalidate=false }={}) {
	let initial_form = Object.entries(spec).reduce((acc, [k, { value }]) => {
		acc[k] = value || null;
		return acc;
	}, {});

	const [ form, setForm ] = React.useState(initial_form);
	const [ errors, setErrors ] = React.useState({});

	const setError = React.useCallback((key, error) => {
		return setErrors(errors => {
			return {...errors, [key]: error};
		 });
	}, []);

	const validate = React.useCallback((values=null, with_errors=false) => {
		let _errors = {...errors};

		for(let [k, v] of Object.entries(values)) {
			// In plural and singular for retrocomp
			let { validators, validator, type, required, ...rest } = spec[k];
			// required, min, max, type, pattern, flags
			validators = get_validators({ validators, validator, type, required, name: k });
			if(validators.length) {
				let valid = run_validators(validators, { ...rest, type, required, value: v, form, name: k });
				if(valid !== true) {
					_errors[k] = valid;
				} else {
					if(_errors[k]) {
						delete _errors[k];
					}
				}
			}
		}

		if(autovalidate || with_errors) {
			setErrors(_errors);
		}

		if(Object.keys(_errors).length > 0) {
			return false;
		}

		return true;
	}, [spec, form, errors, autovalidate]);

	const validate_all = React.useCallback((names=null, with_errors=false) => {
		if(names) {
			let spec = names.reduce((acc, name) => {
				acc[name] = form[name];
				return acc;
			}, {});
			return validate(spec, with_errors);
		}

		// If empty call
		if(!names && with_errors === undefined) {
			with_errors = true;
		}
		return validate(form, with_errors);
	}, [validate, form]);

	const setValues = React.useCallback((spec) => {
		let new_form = {...form, ...spec};
		setForm(new_form);
		validate(spec);
	}, [form, validate]);

	const valid = validate_all(null, false);

	return { form, valid, errors, setValues, validate: validate_all, setError };
}
