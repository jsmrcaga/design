import React from 'react';

import Style from './checkable.module.css';

export function Checkable({ type='checkbox', label='', onChange=()=>{}, style={}, children, className='', name='', disabled, ...rest }) {
	let _type = type === 'toggle' ? 'checkbox' : type;
	return (
		<label style={style} type={type} className={`${Style['checkable']} ${Style[type]} ${className} ${disabled ? Style['disabled'] : ''}`}>
			<input type={_type} name={name} onChange={onChange} className={`${Style['checkable-input']} ${Style[type]}`} disabled={disabled} {...rest}/>
			<span className={`${Style['checkable-mark']} ${type}`}/>
			{children || label}
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
