import React from 'react';
import { classnames } from '../../utils/classnames';

import Style from './containers.module.css';

export function Container({ className='', children, fluid=false, centered=false, ...rest }) {
	let _class = Object.entries({ fluid, centered }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	return (
		<div className={classnames(Style['container'], className, _class)} {...rest}>
			{children}
		</div>
	);
}


export function Box({ className='', children, lifted, ...rest }) {
	return (
		<div className={classnames(Style.box, className, { [Style.lifted]: lifted })} {...rest}>
			{children}
		</div>
	);
}

export function Card({ className='', children, ...rest }) {
	return (
		<div className={classnames(Style['card'], className)} {...rest}>
			{children}
		</div>
	);
}

export const CardGroup = React.forwardRef(({ className='', children }, ref) => {
	return (
		<div className={classnames(className, Style['card-group'])}>
			{children}
		</div>
	);
});

export function Row({ className='', children, ...rest }) {
	let _class = `${Style['row']} ${className}`;
	return (
		<div className={_class} {...rest}>
			{children}
		</div>
	);
}
