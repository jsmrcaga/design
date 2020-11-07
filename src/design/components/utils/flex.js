import React from 'react';

import Style from './flex.module.css';

export function Flex({ className='', children, vertical }) {
	let _class = Object.entries({ vertical }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');

	return (
		<div className={`${_class} ${className} ${Style['flex']}`}>
			{children}
		</div>
	);
}
