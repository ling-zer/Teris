const path = require("path")
const HtmlWebpackPlugin  = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve("./dist"), //将相对路径转换为绝对路劲，path后必须是绝对路径
        filename: "script/bundle.js" // 把文件打包为一个文件
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new CleanWebpackPlugin(), // 先清理掉之前的打包文件，然后重新打包
    ],
    module: {
        rules: [ // 加载规则
            {test: /.ts$/, loader: "ts-loader"}
        ]
    },
    resolve: {
        extensions: [".ts", ".js"] // 解析模块时，后缀名为ts和js都会查找以下有没有
    }
}