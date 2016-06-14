var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var srcDir = path.resolve(process.cwd(), 'src');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        console.log(item.match);

        // 外層的直接 return
        if (/(.+)\.js/.test(item)) {
            return;
        }

        // lib 文件 return
        if (/(.*)lib/.test(item)) {
            return;
        }

        // 其餘目录可以作为 entry
        matchs = item.match(/(.+)$/);

        if (matchs) {
            var entryDir = path.resolve(srcDir, 'js', item, (item + '.js'));

            if (fs.existsSync(entryDir)) {
                files[matchs[1]] = entryDir;
            }
        }
    });

    console.log(JSON.stringify(files));
    return files;
}

module.exports = {
    devtool: 'source-map',
    cache: true,
    entry: getEntry(),
    output: {
        path: path.join(__dirname, "dist/static/js/"),
        publicPath: "/static/js/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    resolve: {
        alias: {
            zepto: srcDir + "/js/lib/zepto.js",
            jsmod: srcDir + "/js/lib/jsmod.js",
            iscroll: srcDir + "/js/lib/iscroll.js",
            plupload: srcDir + "/js/lib/plupload.dev.js",
            moxie: srcDir + "/js/lib/moxie.js"
        }
    },
    plugins: [
        new CommonsChunkPlugin('common.js'),
        new webpack.ProvidePlugin({
            $: "zepto",
            jsmod: "jsmod",
            IScroll: "iscroll",
            plupload: 'plupload',
            mOxie: 'moxie'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: [ 'babel' ],
                exclude: /node_modules/,
                include: path.join(__dirname, "src/js/")
            },
            {
                test: /\.styl$/,
                exclude: /node_modules/,
                include: path.join(__dirname, "src/js/"),
                loader: 'style-loader!css-loader!stylus-loader'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                include: path.join(__dirname, "src/js/"),
                loader: 'style-loader!css-loader'
            },
            { 
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                exclude: /node_modules/,
                include: path.join(__dirname, "src/js/"),
                loader: 'url-loader?limit=5000&name=[path][name].[ext]'
            },
            {
                test: require.resolve(srcDir + "/js/lib/zepto.js"),
                loader: 'exports?window.$'
            },
            {
                test: require.resolve(srcDir + "/js/lib/jsmod.js"),
                loader: 'exports?window.jsmod'
            },
            {
                test: require.resolve(srcDir + "/js/lib/iscroll.js"),
                loader: 'exports?window.IScroll'
            },
            {
                test: require.resolve(srcDir + "/js/lib/plupload.full.min.js"),
                loader: 'exports?window.plupload'
            },
            {
                test: require.resolve(srcDir + "/js/lib/moxie.js"),
                loader: 'exports?window.mOxie'
            }
        ]
    }
};