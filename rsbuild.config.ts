import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSvgr({
      svgrOptions: {
        exportType: 'default',
      },
    }),
  ],

  source: {
    entry: {
      index: './src/bootstrap.tsx',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
      'process.env.APP_AUTH_URL': JSON.stringify(
        process.env.APP_AUTH_URL || 'http://localhost:8888'
      ),
    },
  },

  html: {
    template: './public/index.html',
  },

  server: {
    port: 2000,
    open: false,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },

  output: {
    assetPrefix: 'auto',
    distPath: {
      root: 'dist',
    },
    cleanDistPath: true,
    dataUriLimit: {
      svg: 0, // Never inline SVG as data URI
    },
  },

  // Module Federation configuration
  moduleFederation: {
    options: {
      name: 'budtr',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
        './BudgetVsActual': './src/features/overview/components/insights/BudgetVsActual.tsx',
        './SpendingTrends': './src/features/overview/components/insights/SpendingTrends.tsx',
        './CategoryBreakdown': './src/features/overview/components/insights/CategoryBreakdown.tsx',
        './MonthlyComparison': './src/features/overview/components/insights/MonthlyComparison.tsx',
        './SavingsProgress': './src/features/overview/components/insights/SavingsProgress.tsx',
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: '^19.1.0',
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '^19.1.0',
        },
        'react/jsx-runtime': {
          singleton: true,
          eager: true,
          requiredVersion: '^19.1.0',
        },
        'react/jsx-dev-runtime': {
          singleton: true,
          eager: true,
          requiredVersion: '^19.1.0',
        },
      },
    },
  },

  // Tools configuration
  tools: {
    rspack: {
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
      module: {
        rules: [
          {
            test: /\.svg$/,
            type: 'javascript/auto',
          },
        ],
      },
    },
  },

  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
    },
  },

  dev: {
    hmr: true,
    liveReload: true,
  },
});
