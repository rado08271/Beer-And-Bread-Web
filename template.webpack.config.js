const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    // target: 'node',
    resolve: {
        fallback: {
            // "stream": false,
            // "crypto": false,
            // "assert": false,
            // "http": false,
            // "https": false,
            // "os": false,
            // "url": false,
            // "stream": require.resolve("stream-browserify"),
            // "crypto": require.resolve("crypto-browserify"),
            // "assert": require.resolve("assert/"),
            // "http": require.resolve("stream-http"),
            // "https": require.resolve("https-browserify"),
            // "os": require.resolve("os-browserify/browser"),
            // "url": require.resolve("url/"),

        }
    }
};