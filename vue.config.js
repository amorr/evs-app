module.exports = {
    pluginOptions: {
        electronBuilder: {
            // List native deps here if they don't work
            externals: ['sqlite3'],
            // If you are using Yarn Workspaces, you may have multiple node_modules folders
            // List them all here so that VCP Electron Builder can find them
            nodeModulesPath: ['../../node_modules', './node_modules'],
            nodeIntegration: true,
            builderOptions: {
                productName: 'IMS-C'
            },
        }
    },
    chainWebpack: config => {
        config.merge({
            externals: {
                sqlite3: 'commonjs sqlite3'
            }
        })
        config.plugin('html').tap(args => {
                args[0].title = '最会做鸡的男人'
                return args
            })
        
    },
    configureWebpack: {
        devServer: {
          watchOptions: {
            ignored: [/public\/base.db/],
          }
        }
      }
};