const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackTools = require('openfin-service-tooling').webpackTools;

const { NODE_ENV = 'development' } = process.env;
const outputDir = path.resolve(__dirname, './dist');

module.exports = [
    webpackTools.createConfig(outputDir, './src/index.tsx', {extractStyles: 'styles'}, webpackTools.manifestPlugin, webpackTools.versionPlugin, new HtmlWebpackPlugin({
        chunks: ['main', 'styles.[hash]-[name].css'],
        env: NODE_ENV,
        filename: 'index.html',
        template: path.join(__dirname, 'res/index.html'),
    }))
];
