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

			onClickAway();
		};

		window.document.addEventListener('click', listener, true);

		return () => {
			window.document.removeEventListener('click', listener, true);
		};
	}, [ref, onClickAway, ...deps]);
};
