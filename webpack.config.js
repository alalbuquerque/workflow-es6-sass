const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: __dirname + '/src/index.html',
	filename: 'index.html',
	inject: true
})

const prod = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'
const ip = require('ip')
const serverIp = ip.address()

module.exports = {
	cache: isDevelopment,
	entry: './src/js/app.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: isDevelopment ? `http://${serverIp}:8080/` : ''
	},
	// resolve: {
	// 	modules: [path.resolve(__dirname, './src'), 'node_modules']
	// },
	externals: {
		foundation: 'foundation-sites'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: path.resolve(__dirname, "src"),
				exclude: /node_modules/,
				query: {
				//   plugins: ['transform-runtime'],
				  presets: ['@babel/preset-env']
				},
			},
			{
				test: /\.scss$/,
				use: prod
					? ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: ['css-loader', 'resolve-url-loader', 'sass-loader']
					})
					: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
					})
			},
			{
				test: [/\.(svg|png|jpg|gif)$/],
				loader: 'file-loader',
				options: {
					name: 'img/[name].[ext]'
				}
			},
			{
				test: [/\.(ttf|eot|woff|woff2)$/],
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]'
				}
			}
		]
	},
	plugins: prod ? [
		new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
		new webpack.optimize.UglifyJsPlugin({
		  compress: {
			screw_ie8: true,
			warnings: false
		  }
		}),
		new webpack.ProvidePlugin({
			jQuery: 'jquery',
			$: 'jquery'
		}),
		HTMLWebpackPluginConfig
	  ] : [
		new webpack.DefinePlugin({'process.env.NODE_ENV': '"development"'}),
		new DashboardPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.ProvidePlugin({
			jQuery: 'jquery',
			$: 'jquery'
		}),
		new ExtractTextPlugin('dist/css/app.css'),
		HTMLWebpackPluginConfig
	  ],
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		hot: true,
		inline:true,
		host: '0.0.0.0',
	}
}

// WIP https://github.com/JonathanMH/webpack-scss-sass-file
