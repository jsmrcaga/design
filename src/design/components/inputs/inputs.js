import React from 'react';

import Style from './inputs.module.css';

function InputIcon({ icon=null, onClick }) {
	if(!icon) {
		return null;
	}
	return <i className={`${icon} ${Style['gg-icon']} small ${onClick ? Style['clickable'] : ''}`} onClick={onClick ?? (() => {})}/>;
}

export const FieldInput = React.forwardRef(({ label, className='', required, name, message='', error=false, warning=false, disabled=false, icon=false, loading=false, inline=false, onIconClick=null, ...rest }, ref) => {
	if(loading) {
		icon = 'gg-loadbar';
	}

	let classes = Object.entries({ error, warning, disabled, loading, icon, inline }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	let _class = `${Style['input-field']} ${className} ${classes}`;

	return (
		<div className={_class}>
			<label htmlFor={name}>
				{label}
				{required && <span className={Style['required']}>*</span>}
				{message && <span className={Style['message']}>{message}</span>}
			</label>
			<input ref={ref} className={Style['text-input']} disabled={disabled || loading} name={name} {...rest}/>
			<InputIcon icon={icon} onClick={onIconClick}/>
		</div>
	);
});

export const SimpleInput = React.forwardRef(({ className='', icon, loading, disabled, inline=false, onIconClick=null, ...rest }, ref) => {
	let classes = Object.entries({ disabled, loading, inline }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	if(loading) {
		icon = 'gg-loadbar';
	}

	if(icon) {
		classes += ` ${Style['icon']}`;
	}

	return (
		<div className={`${Style['simple-input']} ${className} ${classes}`}>
			<input ref={ref} disabled={disabled || loading} className={Style['text-input']} {...rest}/>
			<InputIcon icon={icon} onClick={onIconClick}/>
		</div>
	);
});

export const Password = React.forwardRef(({ simple, type, ...rest }, ref) => {
	const [ show, setShow ] = React.useState(false);
	let Component = simple ? SimpleInput : FieldInput;

	return <Component
		ref={ref}
		icon={show ? 'gg-eye-alt' : 'gg-eye'}
		onIconClick={() => setShow(show => !show)}
		type={show ? 'text' : 'password'}
		{...rest}
	/>
});

export const Input = React.forwardRef(({ simple, type, ...rest }, ref) => {
	let Component = type === 'password' ? Password : (simple ? SimpleInput : FieldInput);
	return <Component ref={ref} simple={simple} type={type} {...rest}/>;
});
