import path from 'path';
import CompressionPlugin from 'compression-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import createStyledComponentsTransformer from 'typescript-plugin-styled-components';

const styledComponentsTransformer = createStyledComponentsTransformer();

const createReactScriptHtmlWebpackConfig = () => {
  if (process.env.BUILD_OFFLINE) {
    return {
      reactScript: '',
      reactDomScript: '',
    };
  }
  const createReactScriptTags = (environment: string) => ({
    reactScript: `<script crossorigin src="https://unpkg.com/react@17/umd/react.${environment}.js"></script>`,
    reactDomScript: `<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.${environment}.js"></script>`,
  });

  if (process.env.NODE_ENV === 'development') {
    return createReactScriptTags('development');
  }
  return createReactScriptTags('production.min');
};

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  entry: './src/client',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '', // default is 'auto', which we don't want
  },
  module: {
    rules: [
      {
        test(modulePath: string) {
          return (
            (modulePath.endsWith('.ts') || modulePath.endsWith('.tsx')) &&
            !(modulePath.endsWith('test.ts') || modulePath.endsWith('test.tsx'))
          );
        },
        include: [path.resolve(__dirname, 'src')],
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({
            before: [styledComponentsTransformer],
          }),
        },
      },
      // All output '.js' files will have any sourcemaps pre-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },

  /* From the TypeScript boilerplate repo webpack config:
  "When importing a module whose path matches one of the following, just assume a corresponding
  global variable exists and use that instead. This is important because it allows us to avoid
  bundling all of our dependencies, which allows browsers to cache those libraries between builds."
  */
  ...(!process.env.BUILD_OFFLINE && {
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  }),
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    new CompressionPlugin(),
    new HtmlWebpackPlugin({
      ...createReactScriptHtmlWebpackConfig(),
      template: 'public/index-template.html',
    }),
  ],
};
