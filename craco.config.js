module.exports = {
    entry: './src/index.tsx',
    target: 'node',
    babel: {
        loaderOptions: {
            ignore: ['./node_modules/mapbox-gl/dist/mapbox-gl.js'],
        },
    },
    module: {
        rules: [{
            use: {
                loader: 'babel-loader',
                options: {
                    // presets: ['my-custom-babel-preset'],
                    ignore: [ './node_modules/mapbox-gl/dist/mapbox-gl.js' ]
                }
            }
        }]
    },
    resolve: {
        fallback: {
            // "stream": false,
            // "crypto": false,
            // "assert": false,
            // "http": false,
            // "https": false,
            // "os": false,
            // "url": false,
            "stream": require.resolve("stream-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "assert": require.resolve("assert/"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "url": require.resolve("url/"),

        }
    }
};