module.exports = function (api) {
	api.cache(true);
	const presets = ['@babel/preset-env', '@babel/preset-react'];
	const plugins = [
		'inline-react-svg',
		'@babel/plugin-proposal-export-default-from',
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-proposal-object-rest-spread'
	];

	return {
		presets,
		plugins
	};
};
