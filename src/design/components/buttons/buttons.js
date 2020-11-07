import React from 'react';

import Style from './buttons.module.css';

export function Button({ big, primary, success, disabled, clear, danger, dark, small, flat, content, loading, children, className='', ...rest }) {
	let _class = Object.entries({ big, primary, success, clear, danger, dark, small, flat }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	_class = `${_class} ${className}`;
	return (
		<button disabled={disabled || loading} className={`${Style['button']} ${_class}`} {...rest}>
			{children || content}
			{
				loading &&
				<i className={`gg-loadbar ${Style['gg-icon']} ${small ? Style['small'] : ''}`}/>
			}
		</button>
	);
}

export function Tag({ info ,primary, success, disabled, clear, danger, dark, small, flat, content, children, className='', clearable, onClear=()=>{}, ...rest }) {
	let _class = Object.entries({ info, primary, success, clear, danger, dark, small, flat }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	_class = `${_class} ${className}`;
	return (
		<div disabled={disabled} className={`${Style['tag']} ${_class}`} {...rest}>
			{children || content}
			{clearable &&
				<i className={`gg-close-o ${Style['gg-icon']} ${Style['small']}`} onClick={onClear}/>
			}
		</div>
	);
}
