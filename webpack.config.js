const html = require('html-webpack-plugin'),
      path = require('path'),
      extract = require('extract-text-webpack-plugin'), 
      webpack = require('webpack');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'buble-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        stylus: extract.extract({
                            loader: ['css-loader?minimize=true', 'stylus-loader'],
                            fallbackLoader: 'vue-style-loader'
                        })
                    }
                }
            },
            {
                test: /\.png/,
                loader: 'file-loader?name=assets/images/[name].[ext]?[hash]'
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        modules: [path.resolve(__dirname, "app"), path.resolve(__dirname, "auth"), "node_modules"],
        extensions: ['.js', '.vue']
    },
    plugins: [
        new extract('styles.css'),
        new html({template: './index.html'}),
    ],
    devtool: '#eval-source-map',
    devServer: {
        proxy: {
            '**': {
                target: 'http://localhost:8000',
                secure: false
            }
        }
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        })
    ]);
}
