const stylelints = require('./stylelint.config')
const path = require('path');

const CONF = {
  // 是否生成 soucemap
  DEV_TOOL: process.env.NODE_ENV === 'test' ? 'source-map' : false,

  // OneID API 地址
  ONEID_API: process.env['FE_DEV_PROXY_ONEID'] || 'http://127.0.0.1:8000',
  // Stats json 文件地址
  DUMP_STATS_TO: process.env.DUMP_STATS_TO,
  // 是否输出 代码覆盖率 (单测)
  USE_COV: process.env.USE_COV === '1',
  // FE serve 是否将文件写入磁盘
  SERVE_WDISK: process.env.SERVE_WDISK === '1',

  DIST_DIR: process.env.NODE_ENV === 'development' ? 'dev-dist' : 'dist',

  PAGES: {
    // OneID
    oneid: {
      entry: 'src/oneid-app/main.ts',
    },

  },
};

module.exports = {
  lintOnSave: false,
  publicPath: '/_/s/',
  outputDir: CONF.DIST_DIR,

  pages: {
    ...CONF.PAGES,
  },

  transpileDependencies: [
    /node_modules\/(?:iview\/(?!src\/utils\/date\.js)|lg-|lgui\/|long-fe\/)/,
  ],

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },

  // configureWebpack: {
  //   devtool: 'source-map'
  // },

  /**
   * @param {import('webpack-chain')} config 
   */
  chainWebpack(config) {
    setupRules(config);
    setupDefine(config);
    setupDumpStats(config);

    config.optimization.splitChunks(false);
    config.devtool(CONF.DEV_TOOL);

    Object.keys(CONF.PAGES).forEach(page => {
      config.plugins.delete(`preload-${page}`);
      config.plugins.delete(`prefetch-${page}`);
    });

    setupCov(config);

    // config.resolve.alias.set('jquery', 'cash-dom');
    // config.optimization.delete('splitChunks');
    // stats: {chunks: true, entrypoints: true,}

  },

  devServer: {
    writeToDisk: CONF.SERVE_WDISK ? (filePath) => {
      return !(/\.hot-update\./.test(filePath));
    } : false,

    historyApiFallback: {
      rewrites: [
        {
          from: /^\/?$/,
          to: '/_/s/oneid.html',
        },
        ...Object.keys(CONF.PAGES).map(page => ({
          from: new RegExp(`^/${page}/?$`),
          to: `/_/s/${page}.html`,
        })),
      ],
    },

    ...getDevProxy(),
  },
  pluginOptions: {
    lintStyleOnBuild: true,
    stylelint: {
      fix: true,
      ...stylelints,
    },
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
};

function getDevProxy() {
  return {
    disableHostCheck: true,
    proxy: {
      ...(Object.entries({
        oneid: CONF.ONEID_API,
      }).reduce((memo, [url, target]) => {
        memo[`/siteapi/${url}/`] = {
          target,
          changeOrigin: true,
          autoRewrite: true,
          secure: false,
          xfwd: false,
        };

        return memo;
      }, {})),

    },

  };
}


/**
 * @param {import('webpack-chain')} config 
 */
function setupRules(config) {
  config.plugins.delete('fork-ts-checker');

  (function(rule) {
    rule
    .use('json-loader')
    .loader('json-loader');
    rule
    .use('yaml-loader')
    .loader('yaml-loader');
  })(config.module.rule('yml').test(/\.ya?ml$/));

  // make codemirror's tern addon + tern.js work
  (function(rule) {
    rule
      .set('type', 'javascript/auto')
      .set('include', /node_modules/)
    ;
  })(config.module.rule('mjs').test(/\.mjs$/));

  (function(rule) {
    rule.loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options
      });
  })(config.module.rule('vue').use('vue-loader'));

  (function(types) {
    types.forEach(type => {
      config.module.rule(type).use('ts-loader')
        .loader('ts-loader')
          .tap(options => {
            options.configFile = 'tsconfig.run.json';
            return options
          });
    });
  })(['ts', 'tsx']);

  // options: {
  //   
  //   transpileOnly: true,
  // },
}


function setupDumpStats(config) {
  if (CONF.DUMP_STATS_TO) {
    config
    .plugin('stats-dump')
    .use(require("webpack-stats-plugin").StatsWriterPlugin, [{
      filename: CONF.DUMP_STATS_TO,
      transform(data, opts) {
        // console.log('stats opts', opts);

        return JSON.stringify({
          publicPath: opts.compiler.outputOptions.publicPath,
          // xxx: opts.compiler.options.output,

          // 方便更快的找到入口 {app: ['css/a.css', 'js/a.js']}  -> {app: {css: '', js: '', o: []}}
          assetsByChunkName: Object.entries(data.assetsByChunkName).reduce(
            (memo, [name, tgt]) => {
              const itm = memo[name] = {o: []};
              (Array.isArray(tgt) ? tgt : [tgt]).forEach(asset => {
                if (asset.startsWith('css/') && !itm.css) {
                  itm.css = asset;
                } else if (asset.startsWith('js/') && !itm.js) {
                  itm.js = asset;
                } else {
                  itm.o.push(asset);
                }
              });

              return memo;
            },
            {}
          ),
        });
      },
    }]);
  }

}

function setupDefine(config) {
  config
  .plugin('define')
  .tap(args => {
    return args;
  });
}

function setupCov(config) {
  const USE_COV = CONF.USE_COV;

  if (!USE_COV) return;

  config.module.rule('js')
    .use('istanbul-loader')
      .loader('istanbul-instrumenter-loader')
      .options({ esModules: true })
    .before('babel-loader');

  config.devtool('source-map');

  config.output
    .devtoolModuleFilenameTemplate('[absolute-resource-path]')
    .devtoolFallbackModuleFilenameTemplate('[absolute-resource-path]?[hash]');
}
