import React from 'react';

import Style from './checkable.module.css';

export function Checkable({ type='checkbox', label='', onChange=()=>{}, style={}, children, className='', name='', disabled, message, error, ...rest }) {
	let _type = type === 'toggle' ? 'checkbox' : type;

	let classes = Object.entries({ error, disabled }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	let _class = `${Style['checkable']} ${className} ${classes}`;

	return (
		<label style={style} type={type} className={_class}>
			<input type={_type} name={name} onChange={onChange} className={type} disabled={disabled} {...rest}/>
			<span className={`${Style['checkable-mark']} ${type}`}/>
			{children || label}
			{message && <em className={Style['message']}>{message}</em>}
		</label>
	);
}

export function Checkbox(props) {
	return <Checkable {...props}/>;
}

export function Radio(props) {
	return <Checkable type="radio" {...props}/>;
}

export function Toggle(props) {
	return <Checkable type="toggle" {...props}/>;
}
