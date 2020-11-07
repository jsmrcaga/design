import React from 'react';

import Style from './tabs.module.css';

export function Tabs({ centered=false, children, className='' }) {
	let _class = Object.entries({ centered }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	return (
		<div className={`${_class} ${className} ${Style['tabs']}`}>
			<ul>
				{children}
			</ul>
		</div>
	);
}

export function Tab({ children, active, disabled, className='', ...rest }) {
	let _class = Object.entries({ active, disabled, className }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	return (
		<li className={_class} {...rest}>
			{children}
		</li>	
	);
}

Tabs.Tab = Tab;
