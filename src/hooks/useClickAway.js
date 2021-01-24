import React from 'react';

export const useClickAway = (ref, onClickAway=()=>{}, deps=[]) => {
	React.useEffect(() => {
		if(!ref.current) {
			return;
		}

		const listener = (event) => {
			if(ref.current.contains(event.target)) {
				return;
			}

			event.preventDefault();
			onClickAway();
		};

		window.document.addEventListener('click', listener, true);

		return () => {
			window.document.removeEventListener('click', listener, true);
		};
	}, [ref, onClickAway, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
};
