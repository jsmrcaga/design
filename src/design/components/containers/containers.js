import React from 'react';

import Style from './containers.module.css';

export function Container({ className='', children, fluid=false, centered=false, ...rest }) {
	let _class = Object.entries({ fluid, centered }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	return (
		<div className={`${Style['container']} ${className} ${_class}`} {...rest}>
			{children}
		</div>
	);
}


export function Box({ className='', children, lifted, ...rest }) {
	let _class = `${Style['box']} ${className} ${lifted ? Style['lifted'] : ''}`;
	return (
		<div className={_class} {...rest}>
			{children}
		</div>
	);
}

export function Card({ className='', children, ...rest }) {
	let _class = `${Style['card']} ${className}`;
	return (
		<div className={_class} {...rest}>
			{children}
		</div>
	);
}

export function Row({ className='', children, ...rest }) {
	let _class = `${Style['row']} ${className}`;
	return (
		<div className={_class} {...rest}>
			{children}
		</div>
	);
}
