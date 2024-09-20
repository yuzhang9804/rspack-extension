import { defineConfig } from '@rspack/cli'
import { resolve } from 'path'
import { rspack } from '@rspack/core'
import * as RefreshPlugin from '@rspack/plugin-react-refresh'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  context: __dirname,
  entry: {
    background: './src/entry/background.ts',
    content: './src/entry/content.ts',
    popup: './src/entry/popup.tsx',
    options: './src/entry/options.tsx',
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'],
              },
            },
          },
        ],
      },
    ],
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  plugins: [
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.HtmlRspackPlugin({
      template: './src/entry/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new rspack.HtmlRspackPlugin({
      template: './src/entry/options.html',
      filename: 'options.html',
      chunks: ['options'],
    }),
    isDev ? new RefreshPlugin() : null,
    new rspack.CopyRspackPlugin({
      patterns: [{ from: 'manifest.json', to: 'manifest.json' }],
    }),
  ].filter(Boolean),
  experiments: {
    css: true,
  },
})
