import React from 'react';
import ReactDOM from 'react-dom';

import Style from './commands.module.css';

import { Input } from '../inputs/inputs';
import { Tag } from '../buttons/buttons';

function jsx_string(jsx) {
	if(!jsx) {
		return '';
	}

	if(typeof jsx === 'number') {
		return jsx.toString();
	}

	if(Array.isArray(jsx)) {
		return jsx.reduce((acc, tag) => acc + jsx_string(tag), '');
	}

	if(jsx.props?.children) {
		return jsx_string(jsx.props.children);
	}

	return jsx;
}

const CommandBoxContext = React.createContext();

export function CommandBoxContextProvider({ actions=[], initialContext={}, children }) {
	const [ context, setCtx ] = React.useState({
		actions: actions,
		context: initialContext
	});

	const setGlobalActions = React.useCallback((global_actions) => {
		let { actions } = context;
		let new_actions = actions.filter(action => Boolean(action.group));
		new_actions.unshift(...global_actions);
		setCtx({ ...context, actions: new_actions });
	}, [context]);

	const setActions = React.useCallback(acts => {
		let { actions } = context;
		let new_actions = actions.filter(action => !action.group);
		new_actions.push(...acts);
		setCtx({ ...context, actions: new_actions });
	}, [context]);

	const setAllActions = React.useCallback(actions => {
		setCtx({ ...context, actions });
	}, [context]);

	const setContext = React.useCallback(ctx => {
		let { actions } = context;
		setCtx({ actions, context: ctx });
	}, [context]);

	const override = React.useCallback((ctx) => {
		setCtx(ctx);
	}, []);

	return (
		<CommandBoxContext.Provider value={{
			...context,
			setActions,
			setGlobalActions,
			setAllActions,
			setContext,
			override
		}}>
			{children}
		</CommandBoxContext.Provider>
	);
}

export function useCommandBox() {
	const context = React.useContext(CommandBoxContext);
	if(!context) {
		throw new Error('[Command Box] You tried calling useCommandBox without providing context! Please use CommandBoxContextProvider before.');
	}
	return context;
}

export function OverrideCommandBox({ actions, context }) {
	const { setActions, setContext } = useCommandBox();
	React.useEffect(() => {
		setActions(actions);
		setContext(context);
	}, [actions, context, setActions, setContext]);
	return null;
}

export function CommandBoxManager({ showable, shortcut='k' }) {
	const [ show, setShow ] = React.useState(false);
	React.useEffect(() => {
		const ESC = 27;
		const handleKeyDown = ({ keyCode, key, metaKey, shiftKey, altKey, ctrlKey }) => {
			if(key === shortcut && (metaKey || ctrlKey)) {
				setShow(show => !show);
			}

			if(keyCode === ESC) {
				setShow(false);
			}
		};

		const twofingers = ({ touches }) => {
			if(touches.length === 2) {
				setShow(show => !show);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('touchstart', twofingers);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('touchstart', twofingers);
		}
	}, [ shortcut ]);

	if(!show) {
		return null;
	}

	return ReactDOM.createPortal(
		<div className={Style['command-box-container']} onClick={() => setShow(false)}>
			<CommandBox/>
		</div>
	, window.document.body);
}

function CommandBoxContextBox({ context }) {
	if(!context) {
		return null;
	}

	let tags = context.tags?.map((tag, i) => <Tag key={i} disabled className={Style['command-box-tag']}>{tag}</Tag>) || null;

	if(!tags) {
		return null;
	}

	return (
		<div className={Style['command-box-context']}>
			{tags}
		</div>
	);
}

function CommandBoxInput({ onChange=()=>{}, ...rest }) {
	const ref = React.useRef(null);

	React.useLayoutEffect(() => {
		ref.current.focus();
	}, [ref]);

	return (
		<div className={Style['command-box-input']}>
			<Input
				simple
				ref={ref}
				onChange={onChange}
				placeholder="Type a command or search..."
				className={Style['command-input']}
				{...rest}
			/>
		</div>
	);
}

function CommandBoxActionIcon({ icon }) {
	if(!icon) {
		return null;
	}

	return <i className={`${icon} ${Style['gg-icon']}`}/>
}

function CommandBoxAction({ action, active, setActive=()=>{}, selectionMode }) {
	const ref = React.useRef();

	let index = React.useMemo(() => {
		return !isNaN(action.index) ? action.index : action.props?.index;
	}, [action]);

	let className = `${Style['command-box-action']} ${active ? Style['active'] : ''}`;
	const _setActive = React.useCallback(() => {
		if(selectionMode !== 'mouse') {
			return;
		}
		setActive(index);
	}, [setActive, index, selectionMode]);

	if(React.isValidElement(action)) {
		let onClick = action.props.onClick;
		let _action = React.cloneElement(action, { onClick: () => {} });
		return (
			<div ref={ref} data-index={index} className={className} onClick={onClick} onMouseEnter={_setActive}>
				{_action}
			</div>
		);
	}

	return (
		<div ref={ref} data-index={index} className={className} onClick={action.onClick || (() => {})} onMouseEnter={_setActive}>
			<CommandBoxActionIcon icon={action.icon}/>
			{ action.label }
		</div>
	);
}

export function CommandBoxActionGroup({ group, actions, activeAction, setActiveAction, selectionMode }) {
	let content = actions.map((action) => (
		<CommandBoxAction
			key={!isNaN(action.index) ? action.index : action.props?.index}
			setActive={setActiveAction}
			action={action}
			active={activeAction === (!isNaN(action.index) ? action.index : action.props?.index)}
			selectionMode={selectionMode}
		/>
	));

	let separator = (
		<div className={Style['command-box-action-group']}>
			<span>{group}</span>
		</div>
	);

	if(!isNaN(group) && group > 0) {
		// Separator
		separator = <div className={Style['command-box-action-separator']}/>
	}

	if(group === null) {
		separator = null;
	}

	return (
		<React.Fragment>
			{separator}
			{content}
		</React.Fragment>
	);
}

export function CommandBoxActions({ actions=[], activeAction, setActiveAction, selectionMode }) {
	let content = 'No actions available';

	let groups = new Set(actions.map(a => a.group || a.props?.group || null));
	groups = Array.from(groups).map(group => ({
		group,
		actions: []
	}));

	actions.forEach(a => {
		let group = groups.find(g => g.group === (a.group || a.props?.group || null));
		group.actions.push(a);
	});

	content = groups.map(group => (
		<CommandBoxActionGroup
			key={group.group || 'ungrouped'}
			group={group.group}
			actions={group.actions}
			activeAction={activeAction}
			setActiveAction={setActiveAction}
			selectionMode={selectionMode}
		/>
	));

	return (
		<div className={Style['command-box-actions']}>
			{content}
		</div>
	);
}

export function CommandBox() {
	const { actions, context } = useCommandBox();

	const ref = React.useRef();
	const [ filteredActions, setFilteredActions ] = React.useState(actions);
	const [ activeAction, setActiveAction ] = React.useState(0);
	const [ selectionMode, setSelectionMode ] = React.useState('keys');

	const stopper = React.useCallback(e => e.stopPropagation(), []);

	React.useEffect(() => {
		setFilteredActions(actions);
	}, [actions]);

	const filterActions = React.useCallback(({ target: { value }}) => {
		if(!value) {
			return setFilteredActions(actions);
		}

		if(!actions || !actions.length) {
			return;
		}

		let words = value.split(' ');
		setFilteredActions(actions.filter(action => {
			let { label, group } = action;

			if(React.isValidElement(action)) {
				label = jsx_string(action);
			}

			let regs = words.filter(w => w).map(w => new RegExp(w, 'gi'));
			return regs.find(reg => reg.test(label)) || (group && regs.find(reg => reg.test(group)));
		}));
		setActiveAction(0);
	}, [actions]);

	const handleArrows = React.useCallback(({ keyCode }) => {
		const ENTER = 13;
		const DOWN = 40;
		const UP = 38;
		if(![ENTER, DOWN, UP].includes(keyCode)) {
			return;
		}

		setSelectionMode('keys');

		let offset = null;
		if(keyCode === DOWN){
			offset = activeAction + 1 > filteredActions.length - 1 ? filteredActions.length - 1 : activeAction + 1;
		}

		if(keyCode === UP){
			offset = activeAction - 1 < 0 ? 0 : activeAction - 1;
		}

		if(offset !== null) {
			let element = ref.current.querySelector(`[data-index="${offset}"]`);
			if(element) {
				element.scrollIntoView({
					block: 'end',
					behavior: 'smooth'
				});
			}
			return setActiveAction(offset);
		}

		if(keyCode === ENTER) {
			if(!filteredActions[activeAction]) {
				return;
			}

			if(filteredActions[activeAction].onClick) {
				return filteredActions[activeAction].onClick()
			}

			if(filteredActions[activeAction].props?.onClick) {
				return filteredActions[activeAction].props.onClick()
			}
		}
	}, [activeAction, filteredActions, ref]);

	// Assign indexes to support groups later
	const _actions = React.useMemo(() => {
		return filteredActions.sort((a1, a2) => {
			if(!a1.group && !a2.group) {
				return 0;
			}

			if(!a1.group) {
				return -1;
			}

			if(!a2.group) {
				return 1;
			}

			return 0;
		}).map((action, i) => {
			if(React.isValidElement(action)) {
				return React.cloneElement(action, {
					index: i
				});
			}

			action.index = i;
			return action;
		});
	}, [filteredActions]);

	return (
		<div className={`${Style['command-box']} ${Style['animation-bounce']}`} onClick={stopper} ref={ref} onMouseMove={() => setSelectionMode('mouse')}>
			<CommandBoxContextBox context={context}/>
			<CommandBoxInput
				onChange={filterActions}
				onKeyDown={handleArrows}
			/>
			<CommandBoxActions
				actions={_actions}
				activeAction={activeAction}
				setActiveAction={setActiveAction}
				selectionMode={selectionMode}
			/>
		</div>
	);
}
