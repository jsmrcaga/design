import React from 'react';

import Style from './dropdowns.module.css';

import { Input } from '../inputs/inputs';
import { Separator } from '../separators/separators';

export function DropdownOption({ separator, content, label, neutral=false, value, onClick=()=>{}, children, active }) {
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
		<div className={`${Style['dropdown-option']} ${neutral ? Style['neutral'] : (active ? Style['active'] : '')}`} onClick={neutral ? () => {} : onClick}>
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


export function BasicDropdown({ options=[], onChange=()=>{}, open, children, clickable = false, onMouseMove=()=>{}, active_option }) {
	const refContainer = React.useRef(null);
	const [isOpen, setOpen] = React.useState(open);
	useOutsideClickDropdown(refContainer, () => setOpen(false), clickable);

	const content = React.useMemo(() => {
		return options.map((option, index) => {
			let { separator, label, content, value, key, neutral } = option;
			return <DropdownOption
				key={key || value}
				label={label || value}
				value={value}
				content={content}
				separator={separator}
				active={index === active_option}
				neutral={neutral}
				onClick={() => {
					onChange(option);
				}}
			/>
		});
	}, [options, onChange, active_option]);

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
			<div className={`${Style['dropdown-content']} ${isOpen ? Style['open'] : ''}`} onMouseMove={onMouseMove}>
				{ content }
				{ child_options }
			</div>
		</div>
	);
}

export function SearchDropdown({ options, onChange=()=>{}, children, clickable = false, onSearch=()=>{}, ...rest }) {
	const [ open, setOpen ] = React.useState(false);
	const [ filteredOptions, setFilteredOptions ] = React.useState(options);
	// Used for arrow navigation
	const [ activeOption, setActiveOption ] = React.useState(null);

	const filterOptions = React.useCallback(({ target:{ value:searchValue }}) => {
		onSearch(searchValue);

		let filtered = options.filter(({ label, value }) => {
			let regs = searchValue.split(' ').map(v => new RegExp(v, 'gi'));
			return Boolean(regs.find(reg => reg.test(label || value)));
		}, []);

		setFilteredOptions(filtered);
	}, [options, onSearch]);

	const handleEvent = React.useCallback((state) => {
		if (clickable) {
			return;
		}
		setOpen(state);
	}, [clickable])

	const keyDown = React.useCallback(event => {
		const { keyCode } = event;
		if(![40, 38, 13].includes(keyCode)) {
			return;
		}

		event.preventDefault();

		if(keyCode === 13 && activeOption !== null) {
			return onChange(filteredOptions[activeOption]);
		}

		// down 40 | up 38
		const down = keyCode === 40;
		const max = filteredOptions.length - 1;
		if(activeOption === null) {
			if(down) {
				return setActiveOption(0);
			}

			return setActiveOption(max);
		}

		if(down) {
			return setActiveOption(opt => opt + 1 > max ? max : opt + 1);
		}

		return setActiveOption(opt => opt - 1 < 0 ? 0 : opt - 1);
	}, [activeOption, filteredOptions, onChange]);

	const onMouseMove = React.useCallback(() => {
		setActiveOption(null);
	}, []);

	return (
		<BasicDropdown open={open} options={filteredOptions} onChange={onChange} clickable={clickable} active_option={activeOption} onMouseMove={onMouseMove}>
			{children}
			<Input
				onFocus={() => handleEvent(true)}
				onBlur={() => handleEvent(false)}
				onChange={filterOptions}
				onKeyDown={keyDown}
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

export function Select({ value, onChange, icon='gg-arrow-down-r', ...rest }) {
	const [ innerValue, setValue ] = React.useState('');
	React.useEffect(() => {
		if(value === undefined || value === null) {
			return setValue('');
		}
		setValue(value.label || value.value);
	}, [value]);

	const change = React.useCallback((value) => {
		setValue(value.label || value.value);
		onChange(value);
	}, [onChange])

	return (
		<Dropdown
			search
			simple
			icon={icon}
			value={innerValue}
			onChange={change}
			onSearch={(searchValue) => setValue(searchValue)}
			{...rest}
		/>
	);
}
