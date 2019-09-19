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
    ],
    module: {
        rules: [
            {
                test: /\.css/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './font/[hash].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.png$/,
                use: ['file-loader']
            }
        ]
    }
}