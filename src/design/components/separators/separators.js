import React from 'react';

import Style from './separators.module.css';

export function Separator({ label='', children, className='' }) {
	return (
		<div className={`${Style['separator']} ${className}`}>
			<span/>
			<span className={Style['content']}>{children || label}</span>
			<span/>
		</div>
	);
}
