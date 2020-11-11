import React from 'react';
import ReactDOM from 'react-dom';

import Style from './modals.module.css';

export function Modal({ children, onClose, className='' open=true }) {
	const stopper = React.useCallback(e => e.stopPropagation(), []);

	React.useEffect(() => {
		const exit_on_key = ({ keyCode }) => {
			if(keyCode === 27) {
				return onClose();
			}
		};

		window.addEventListener('keydown', exit_on_key);

		return () => window.removeEventListener('keydown', exit_on_key);
	}, []);

	if(!open) {
		return null;
	}

	let modal = (
		<div className={`${Style['modal-container']} animation-fadein`} onClick={onClose}>
			<div className={Style['closer']} onClick={onClose}></div>
			<div className={`${className} ${Style['content']} animation-bounce`} onClick={stopper}>
				{children}
			</div>
		</div>
	);

	return ReactDOM.createPortal(modal, document.body);
}
