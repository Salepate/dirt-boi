const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
module.exports = {
    entry: './build/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new CopyPlugin([
            { from: 'public', to: path.resolve(__dirname, 'dist')}
        ])
    ]
}