import React from 'react';
import ReactDOM from 'react-dom';

import Style from './toasts.module.css';

export const ToastContext = React.createContext();

function ToastAction({ text, onClick, dismiss }) {
	const click = React.useCallback(() => {
		onClick(dismiss);
	}, [dismiss, onClick]);

	return (
		<div className={Style['toast-action']} onClick={click}>
			{text}
		</div>
	);
}

function ToastActions({ actions, dismiss }) {
	let _actions = actions && actions.length ? actions : [{
		text: 'Dismiss',
		onClick: dismiss,
		dismiss
	}];

	return (
		<div className={Style['toast-actions']}>
			{_actions.map((action, i) => <ToastAction key={i} {...action} dismiss={dismiss}/>)}
		</div>
	);
}

function ToastContent({ content }) { 
	if(React.isValidElement(content)) {
		return content;
	}

	return (
		<div className={Style['toast-content']}>
			{content}
		</div>
	);
}

export function ToastInternal({ id, title, content='', actions, info, warning, error, success, className, dismiss, onDismiss=()=>{}, dismissable=true, autodismiss=true, autoDismissOffset=2500, animation='animation-bounce', animationOutOffset=500, animationOutClass=Style['toast-out'] }) {
	const [ outClass, setOutClass ] = React.useState('');
	const _class = Object.entries({ warning, error, success, info, className }).filter(([ k, v ]) => v).map(([k]) => Style[k]);	
	_class.push(animation, outClass);

	const dismiss_timeout = React.useRef(null);

	// Dismiss proxy
	const _dismiss = React.useCallback(() => {
		if(dismiss_timeout.current) {
			clearTimeout(dismiss_timeout.current);
		}

		dismiss(id);
		onDismiss()
	}, [id, dismiss]);

	React.useEffect(() => {
		if(!autodismiss) {
			return;
		}

		if(dismiss_timeout.current) {
			clearTimeout(dismiss_timeout.current);
		}

		dismiss_timeout.current = setTimeout(() => {
			_dismiss();
		}, autoDismissOffset);

		const outTimeout = setTimeout(() => {
			setOutClass(animationOutClass);
		}, autoDismissOffset - animationOutOffset);

		return () => {
			clearTimeout(dismiss_timeout.current);
			clearTimeout(outTimeout);
		}
	}, []);

	return (
		<div className={`${Style['toast']} ${_class.join(' ')}`} id={id}>
			<div>
				{
					title &&
					<div className={Style['toast-title']}>
						{title}
					</div>
				}
				{
					<ToastContent content={content}/>
				}
			</div>
			{
				(actions || dismissable) &&
				<ToastActions actions={actions} dismiss={_dismiss}/>
			}
		</div>
	);
}

export function ToastContainerInternal({ Toast=ToastInternal, toasts, autoDismissOffset, dismiss }) {
	const _toasts = React.useMemo(() => toasts.map(toast => {
		return (
			<Toast
				key={toast.id}
				dismiss={dismiss}
				autoDismissOffset={autoDismissOffset}
				{...toast}
			/>
		);
	}), [toasts, autoDismissOffset, dismiss]);

	if(!toasts || !toasts.length) {
		return null;
	}

	return ReactDOM.createPortal((
		<div className={Style['toast-container']}>
			{_toasts}
		</div>
	), window.document.body);
}

export function Toasts({ children, ToastContainer=ToastContainerInternal, ...rest }) {
	const [ toasts, setToasts ] = React.useState([]);

	// Dismiss specific toast
	const dismiss = React.useCallback(id => {
		// Remove toast from toasts array
		setToasts(toasts => {
			let toastIndex = toasts.findIndex(toast => toast.id === id);
			if(toastIndex === -1) {
				return toasts;
			}
			let newToasts = [...toasts];
			newToasts.splice(toastIndex, 1);
			return newToasts;
		});
	}, []);

	// Schedule toast
	const toast = React.useCallback((params) => {
		// Create random id
		const id = params.id || Math.floor((Math.random() * 0x10000000)).toString(16).slice(0, 6);
		return setToasts(toasts => [...toasts, {
			id,
			...params
		}]);
	}, []);

	// Public function
	const toastify = React.useCallback((content, params={}, type) => {
		if(typeof params === 'string') {
			type = params;
			params = {};
		}

		params.content = content;

		for(let t of ['info', 'success', 'error', 'warning']) {
			delete params[t];
		}

		if(type){
			params[type] = true;
		}
		return toast(params);
	}, [toast]);

	// Memo to prevent useEffects that use toasts to re-execute
	const context_value = React.useMemo(() => ({
		toast: (...args) => toastify(...args),
		success: (...args) => toastify(...args, 'success'),
		error: (...args) => toastify(...args, 'error'),
		info: (...args) => toastify(...args, 'info'),
		warning: (...args) => toastify(...args, 'warning')
	}), [toastify]);

	return (
		<ToastContext.Provider value={context_value}>
			<ToastContainer
				toasts={toasts}
				dismiss={dismiss}
				{...rest}
			/>
			{children}
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = React.useContext(ToastContext);
	return context;
}

