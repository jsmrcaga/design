import React from 'react';

import Style from './title.module.css';

export function Title({ anchor=null, as='h2', children, title, className='' }) {
	let Component = as;
	return (
		<React.Fragment>
			{anchor && <a id={anchor} href={`#${anchor}`} className={Style['anchor']}>{anchor}</a>}
			<Component className={`${className} title`}>{children || title}</Component>
		</React.Fragment>
	);
}
