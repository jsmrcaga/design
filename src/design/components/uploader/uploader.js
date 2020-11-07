import React from 'react';

import Style from './uploader.module.css';

// File icons
import { ReactComponent as ChartSVG } from '../../iconography/chart.svg';
import { ReactComponent as PdfSVG } from '../../iconography/pdf.svg';
import { ReactComponent as XlsSVG } from '../../iconography/xls.svg';

// Utility Icons
import { ReactComponent as CheckSVG } from '../../iconography/check.svg';
import { ReactComponent as ErrorSVG } from '../../iconography/error.svg';
import { ReactComponent as UploadSVG } from '../../iconography/upload.svg';

export function Uploader({ children, className='', error=false, message='', ref=null, onDragOver=()=>{}, onChange=()=>{}, mimes=null, ...rest }) {
	let _class = Object.entries({ error }).filter(([, v]) => v).map(([k]) => Style[k]).join(' ');

	const inputChange = React.useCallback((event) => {
		let _files = event.target.files;
		let files = [];
		for(let i = 0; i < _files.length; i++) {
			files.push(_files[i]);
		}
		onChange(files);
	}, [onChange]);

	const dragOver = React.useCallback(e => { e.preventDefault(); onDragOver(e) }, [onDragOver]);

	let other_props = {};
	if(mimes) {
		other_props.accept = mimes.join(', ');
	}

	return (
		<div className={`${_class} ${className} ${Style['uploader']}`}>
			<label onDragOver={dragOver} {...rest}>
				<input type="file" onChange={inputChange} ref={ref} {...other_props}/>
				<div className={Style['uploader-content']}>
					{children}
				</div>
			</label>
		</div>
	);
}

export function UploaderIcon({ Icon, children, className='' }) {
	return (
		<React.Fragment>
			<div className={`${Style['uploader-icon']} animation-bounce`}>
				<Icon className={className}/>
			</div>
			{ children }
		</React.Fragment>
	);
}

export function FileLoaded({ files }) {
	return (
		<UploaderIcon Icon={CheckSVG} className={Style['loaded-file']}>
			{`Loaded ${files.map(i => i.name).join(', ')}`}
		</UploaderIcon>
	);
}

export function NoFile() {
	return (
		<UploaderIcon Icon={UploadSVG}>
			Drag & drop a file or click here to browse!
		</UploaderIcon>
	);
}

export function ValidFile() {
	return (
		<React.Fragment>
			<div className={`${Style['uploader-valid-file']} animation-bounce`}>
				<ChartSVG className={Style['file-left']}/>
				<XlsSVG className={Style['file-right']}/>
				<PdfSVG className={Style['file-center']}/>
			</div>
			Drop your file!
		</React.Fragment>
	);
}

export function InvalidFile() {
	return (
		<UploaderIcon className={Style['error-icon']} Icon={ErrorSVG}>
			File type noy supported
		</UploaderIcon>
	);
}

export const DefaultStates = {
	'none': NoFile,
	'valid': ValidFile,
	'invalid': InvalidFile,
	'loaded': FileLoaded
};

export function FileUploader({ onChange=()=>{}, onDragLeave=()=>{}, mimes=null, states={}, ...rest }) {
	const [ state, setState ] = React.useState('none');
	const [ files, setFiles ] = React.useState(null);

	const change = React.useCallback((files) => {
		setFiles(files);
		onChange(files);
	}, [ onChange ]);

	const file_getter = React.useCallback(({ dataTransfer }, isEnter=false) => {
		let files = [];

		if(isEnter && dataTransfer.items.length) {
			for(let i = 0; i < dataTransfer.items.length; i++) {
				let item = dataTransfer.items[i];
				if (item.kind === 'file') {
					files.push(item);
				}
			}
			return files;
		}

		if(dataTransfer.files.length) {
			for(let i = 0; i < dataTransfer.files.length; i++) {
				let file = dataTransfer.files[i];
				files.push(file);
			}
			return files;
		}

		return null;
	}, []);

	const validate_files = React.useCallback(files => {
		if(mimes) {
			for(let file of files) {
				if(!mimes.includes(file.type)) {
					return false;
				}
			}
		}

		return true;
	}, [mimes]);

	const onDragEnter = React.useCallback((event) => {
		event.preventDefault();
		let files = file_getter(event, true);
		// validate file
		let valid = validate_files(files);
		if(!valid) {
			return setState('invalid');
		}

		setState('valid');
	}, [ file_getter, validate_files ]);

	const _onDragLeave = React.useCallback((event) => {
		let state = 'none';
		if(files && files.length) {
			state = 'loaded';
		} else {
			state = 'none';
		}
		setState(state);
		onDragLeave(state);
	}, [files, onDragLeave]);

	const inputChange = React.useCallback((files) => {
		let valid = validate_files(files);
		if(!valid) {
			return setState('invalid');
		}

		setState('loaded');
		change(files);
	}, [change, validate_files]);

	const onDrop = React.useCallback((event) => {
		event.preventDefault();
		let files = file_getter(event);
		// validate file
		let valid = validate_files(files);
		if(!valid) {
			return setState('none');
		}

		// if file valid
		setState('loaded');
		change(files);
	}, [change, file_getter, validate_files]);

	let StateComponent = states[state] || DefaultStates[state];

	return (
		<Uploader
			onChange={inputChange}
			onDragEnter={onDragEnter}
			onDragLeave={_onDragLeave}
			onDrop={onDrop}
			mimes={mimes}
			{...rest}
		>
			<StateComponent files={files}/>
		</Uploader>
	);
}
