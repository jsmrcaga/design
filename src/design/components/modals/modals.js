import React from 'react';
import ReactDOM from 'react-dom';

import Style from './modals.module.css';

export function Modal({ children, onClose, open=true }) {
	const stopper = React.useCallback(e => e.stopPropagation(), []);

	if(!open) {
		return null;
	}

	let modal = (
		<div className={`${Style['modal-container']} ${Style['animation-fadein']}`} onClick={onClose}>
			<div className={Style['closer']} onClick={onClose}></div>
			<div className={`${Style['content']} ${Style['animation-bounce']}`} onClick={stopper}>
				{children}
			</div>
		</div>
	);

	return ReactDOM.createPortal(modal, document.body);
}
