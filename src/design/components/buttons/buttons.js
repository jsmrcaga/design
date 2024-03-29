import React from 'react';

import { classnames } from '../../utils/classnames';

import Style from './buttons.module.css';

export const Button = React.forwardRef(({ big, primary, success, warning, disabled, clear, danger, dark, small, flat, content, loading, children, className='', type='button', ...rest }, ref) => {
	let _class = Object.entries({ big, primary, success, warning, clear, danger, dark, small, flat }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	_class = `${_class} ${className}`;
	return (
		<button ref={ref} disabled={disabled || loading} className={`${Style['button']} ${_class}`} type={type} {...rest}>
			{children || content}
			{
				loading &&
				<i className={`gg-loadbar ${Style['gg-icon']} ${small ? Style['small'] : ''}`}/>
			}
		</button>
	);
});

export function Tag({ info, pill=false, primary, warning, success, disabled, clear, danger, dark, small, flat, content, children, className='', clearable, onClick=null, onClear=null, ...rest }) {
	let _class = Object.entries({ info, pill, primary, warning, success, clear, danger, dark, small, flat }).filter(([k, v]) => v).map(([k]) => Style[k]);
	return (
		<div disabled={disabled} className={classnames(Style['tag'], className, {[Style.clickable]: onClick}, ..._class)} {...rest} onClick={onClick}>
			{pill && <div className={Style['pill']}/>}
			{children || content}
			{clearable &&
				<i className={`gg-close-o ${Style['gg-icon']} ${Style['small']}`} onClick={onClear}/>
			}
		</div>
	);
}
