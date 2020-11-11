import React from 'react';

import Style from './tooltips.module.css';

export function Tooltip({ content, show=null, type='hover', position='top', children, className='', containerClassName='' }) {
	const functional_show = React.useMemo(() => {
		if(show === true) {
			return Style['displayed'];
		}

		if(show === false) {
			return Style['hidden'];
		}

		return;
	}, [show]);
	return (
		<div className={`${Style['tooltip-container']} ${Style[type]}`}>
			<div className={`${Style['tooltip']} ${Style[position]} ${className} ${functional_show}`}>
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
