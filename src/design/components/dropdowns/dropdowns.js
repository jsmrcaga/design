import React from 'react';

import Style from './dropdowns.module.css';

import { Input } from '../inputs/inputs';
import { Separator } from '../separators/separators';

export function DropdownOption({ separator, content, label, value, onClick=()=>{}, children }) {
	if(separator === true) {
		return <Separator className={Style['dropdown-separator']}/>;
	}

	if(separator) {
		return <Separator className={Style['dropdown-separator']}>{separator}</Separator>;
	}

	let child = content;
	if(!content && label) {
		child = <span>{label}</span>;
	}

	return (
		<div className={Style['dropdown-option']} onClick={onClick}>
			{ child }
			{ children }
		</div>
	);
}


function useOutsideClickDropdown(ref, onClick, enabled=false) {

	const _onClick = React.useMemo(() => onClick, [onClick]);

	React.useEffect(() => {
		if (!enabled) {
			return;
		}
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				_onClick();
			}
		}
		// Bind the event listener
		document.addEventListener("click", handleClickOutside);

		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("click", handleClickOutside);
		};
	}, [ref, _onClick, enabled]);
}


export function BasicDropdown({ options=[], onChange=()=>{}, open, children, clickable = false }) {
	const refContainer = React.useRef(null);
	const [isOpen, setOpen] = React.useState(open);
	useOutsideClickDropdown(refContainer, () => setOpen(false), clickable);

	const content = React.useMemo(() => {
		return options.map((option, index) => {
			let { separator, label, content, value, key } = option;
			return <DropdownOption
				key={key || value}
				label={label}
				value={value}
				content={content}
				separator={separator}
				onClick={() => {
					onChange(option);
				}}
			/>
		});
	}, [options, onChange]);

	let { child_options, triggers } = React.useMemo(() => {
		let children_array = React.Children.toArray(children);
		// Like instanceof, but for functions
		let options_available = [DropdownOption.name, Separator.name];
		let child_options = children_array.filter(c => options_available.includes(c.type.name));
		// Map to add special class to separators
		child_options = child_options.map(child => {
			if(child.type.name !== Separator.name) {
				return child;
			}

			return React.cloneElement(
				child,
				{
					...child.props,
					className: `${child.props.className} ${Style['dropdown-separator']}`
				}
			);
		});
		let triggers = children_array.filter(c => !options_available.includes(c.type.name));
		return { child_options, triggers };
	}, [children]);

	const handleClick = React.useCallback((e) => {
		if (!clickable) {
			return;
		}

		setOpen(open => {
			return !open;
		});
	}, [clickable]);

	React.useEffect(() => {
		setOpen(open);
	}, [open])

	return (
		<div ref={refContainer} className={`${Style['dropdown-container']} ${clickable ? Style['clickable'] : ''}`}>
			<div className={Style['dropdown-input']} onClick={handleClick}>
				{ triggers }
			</div>
			<div className={`${Style['dropdown-content']} ${isOpen ? Style['open'] : ''}`}>
				{ content }
				{ child_options }
			</div>
		</div>
	);
}

export function SearchDropdown({ options, onChange=()=>{}, value, children, clickable = false, ...rest }) {
	const [ open, setOpen ] = React.useState(false);
	const [ filteredOptions, setFilteredOptions ] = React.useState(options);

	const filterOptions = React.useCallback(({ target:{ value }}) => {
		let words = value.split(' ');

		let filtered = options.filter(({ label }) => {
			for(let word of words) {
				let reg = new RegExp(word, 'gi');
				if(reg.test(label)) {
					return true;
				}
			}

			return false;
		}, []);

		setFilteredOptions(filtered);
	}, [options]);

	const handleEvent = React.useCallback((state) => {
		if (clickable) {
			return;
		}
		setOpen(state);
	},[clickable])

	return (
		<BasicDropdown open={open} options={filteredOptions} onChange={onChange} clickable={clickable}>
			{children}
			<Input
				onFocus={() => handleEvent(true)}
				onBlur={() => handleEvent(false)}
				onChange={filterOptions}
				{...rest}
			/>
		</BasicDropdown>
	);
}

export function Dropdown({ search=false, ...rest }) {
	let Component = search ? SearchDropdown : BasicDropdown;
	return <Component {...rest}/>;
}

Dropdown.Option = DropdownOption;
Dropdown.Separator = Separator;
