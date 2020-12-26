import React from 'react';

import Style from './drawer.module.css';
import ModalStyle from '../modals/modals.module.css';

export function Drawer({ children, open=false, onClose=()=>{}, closeOnClickAway=true }) {
	const drawerRef = React.useRef(null);

	React.useEffect(() => {
		if(!closeOnClickAway) {
			return;
		}

		if(!open) {
			return;
		}

		const listener = (event) => {
			if(drawerRef.current.contains(event.target)) {
				return;
			}

			onClose('click-away');
		};

		window.document.addEventListener('click', listener, true);

		return () => {
			window.document.removeEventListener('click', listener, true);
		};
	}, [open, onClose, drawerRef, closeOnClickAway]);

	return (
		<div className={`${Style['drawer']} ${open ? Style['open'] : ''}`} ref={drawerRef}>
			<div className={`${Style['drawer-closer']} ${ModalStyle['closer']}`} onClick={() => onClose('button')}/>
			{ children }
		</div>
	);
}
