import React from 'react';

import Style from './drawer.module.css';
import ModalStyle from '../modals/modals.module.css';

import { useClickAway } from '../../../hooks/useClickAway';

export function Drawer({ children, open=false, onClose=()=>{}, closeOnClickAway=true, depth=0 }) {
	const drawerRef = React.useRef(null);

	useClickAway(drawerRef, () => {
		if(!closeOnClickAway) {
			return;
		}

		if(!open) {
			return;
		}

		onClose('click-away');
	});

	const style = {};
	if(depth > 0) {
		style.width = `calc(var(--width) - ${depth * 50}px)`;
		style.zIndex = depth + 10;
	}

	return (
		<div className={`${Style['drawer']} ${open ? Style['open'] : ''}`} style={style} ref={drawerRef}>
			<div className={`${Style['drawer-closer']} ${ModalStyle['closer']}`} onClick={(e) => onClose('button')}/>
			{ children }
		</div>
	);
}
