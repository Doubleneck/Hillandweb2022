module.exports = {
  // ... other webpack configuration options
  module: {
    rules: [
      // ... other rules
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
}