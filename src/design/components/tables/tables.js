import React from 'react';

import Style from './tables.module.css';

export function Td({ selected, className='', children, ...props}) {
	return <td className={`${className} ${selected ? Style['selected']: ''}`} {...props}>{children}</td>;
}

export function Tr({ warning, success, danger, selected, className='', children, ...props}) {
	const _class = Object.entries({ warning, success, danger }).filter(([k, v]) => v).map(([k]) => Style[k]).join(' ');
	return <tr className={`${className} ${_class} ${selected ? Style['selected']: ''}`} {...props}>{children}</tr>;
}

export function Table({ children, className='' }) {
	return (
		<div className={Style['responsive-table']}>
			<table className={Style['table']}>
				{children}
			</table>
		</div>
	)
}

Table.Td = Td;
Table.Tr = Tr;
