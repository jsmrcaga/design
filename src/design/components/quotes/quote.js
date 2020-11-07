import React from 'react';

import Style from './quote.module.css';

export function Quote({ className='', warning=false, info=true, success=false, error=false, important=false, children }) {
	let apply_color = Object.entries({ warning, info, success, error }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	let _class = `${Style['quote']} ${apply_color} ${important ? Style['important'] : ''}`
	return (
		<div className={_class}>
			{children}
		</div>
	);
}
