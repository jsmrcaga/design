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

export function BasicDropdown({ options=[], onChange=()=>{}, open, children }) {
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

	return (
		<div className={Style['dropdown-container']}>
			<div className={Style['dropdown-input']}>
				{ triggers }
			</div>
			<div className={`${Style['dropdown-content']} ${open ? Style['open'] : ''}`}>
				{ content }
				{ child_options }
			</div>
		</div>
	);
}

export function SearchDropdown({ options, onChange=()=>{}, value, children, ...rest }) {
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

	return (
		<BasicDropdown open={open} options={filteredOptions} onChange={onChange}>
			{children}
			<Input
				onFocus={() => setOpen(true)}
				onBlur={() => setOpen(false)}
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
