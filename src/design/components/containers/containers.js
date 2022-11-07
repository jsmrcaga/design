import React from 'react';
import { classnames } from '../../utils/classnames';

import Style from './containers.module.css';

export const Container = React.forwardRef(({ className='', children, fluid=false, centered=false, ...rest }, ref) => {
	let _class = Object.entries({ fluid, centered }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	return (
		<div ref={ref} className={classnames(Style['container'], className, _class)} {...rest}>
			{children}
		</div>
	);
});


export const Box = React.forwardRef(({ className='', children, lifted, ...rest }, ref) => {
	return (
		<div ref={ref} className={classnames(Style.box, className, { [Style.lifted]: lifted })} {...rest}>
			{children}
		</div>
	);
});

export const Card = React.forwardRef(({ className='', children, ...rest }, ref) => {
	return (
		<div ref={ref} className={classnames(Style['card'], className)} {...rest}>
			{children}
		</div>
	);
});

export const CardGroup = React.forwardRef(({ className='', children }, ref) => {
	return (
		<div ref={ref} className={classnames(className, Style['card-group'])}>
			{children}
		</div>
	);
});

export const Row = React.forwardRef(({ className='', children, ...rest }, ref) => {
	let _class = `${Style['row']} ${className}`;
	return (
		<div ref={ref} className={_class} {...rest}>
			{children}
		</div>
	);
});
