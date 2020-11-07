import React from 'react';

import Style from './tables.module.css';

export function Td({ selected, className='', children, ...props}) {
	return <td className={`${className} ${selected ? Style['selected']: ''}`} {...props}>{children}</td>;
}

export function Tr({ selected, className='', children, ...props}) {
	return <tr className={`${className} ${selected ? Style['selected']: ''}`} {...props}>{children}</tr>;
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
