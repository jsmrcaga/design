import React from 'react';

import Style from './tooltips.module.css';

export function Tooltip({ content, type='hover', position='top', children, className='', containerClassName='' }) {
	return (
		<div className={`${Style['tooltip-container']} ${Style[type]}`}>
			<div className={`${Style['tooltip']} ${Style[position]} ${className}`}>
				{content}
			</div>
			<div className={containerClassName}>
				{children}
			</div>
		</div>
	);
}

export function Popover(props) {
	return <Tooltip type="active" {...props}/>;
}
