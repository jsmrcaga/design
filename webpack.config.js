const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const export_css_plugin = new MiniCssExtractPlugin();

module.exports = {
	entry: './src/morgoth.js',
	mode: process.env.NODE_ENV || 'development',
	plugins: [
		export_css_plugin,
		new CleanWebpackPlugin(),
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'morgoth.js',
		libraryTarget: 'umd',
		library: '@control/design',
		globalObject: 'this'
	},
	optimization: {
		minimize: process.env.NODE_ENV === 'production',
	},
	externals: {
		react: {
			root: 'React',
			commonjs2: 'react',
			commonjs: 'react',
			amd: 'react',
		},
		'react-dom': {
			root: 'ReactDOM',
			commonjs2: 'react-dom',
			commonjs: 'react-dom',
			amd: 'react-dom',
		},
	},
	module: {
		rules: [{
			test: /.js/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
					presets: [
						'@babel/preset-env',
						'@babel/preset-react'
					],
					plugins: [
						'inline-react-svg',
						'@babel/plugin-proposal-export-default-from',
						'@babel/plugin-syntax-dynamic-import',
						'@babel/plugin-proposal-object-rest-spread'
					]
				}
			}
		}, {
			test: /\.module\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
					options: {
						modules: true,
					}
				},
			]
		}, {
			test: /\.css$/,
			exclude: /\.module\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
					options: {
						modules: false,
					}
				},
			]
		}, {
			test: /\.ttf$/,
			loader: 'file-loader'
		}]
	}
}
