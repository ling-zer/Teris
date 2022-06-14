# 俄罗斯方块游戏

## 概述

使用技术：webpack、jquery、typescript + 面向对象开发

项目目的：

1. 学习TS如何结合webpack做开发
2. 巩固TS的知识
3. 锻炼逻辑思维能力
4. 体验面向对象编程的思想

## 工程搭建

环境：浏览器 + 模块化

webpack：构建工具，根据入口文件找寻依赖，进行打包

1. 安装webpack
2. 安装html-webpack-plugin：打包html模板文件
3. 安装clean-webpack-plugin：打包前先清理之前的打包文件，然后再进行打包
4. 安装webpack-dev-server：检测到代码发生改变后自动更新，在```package.json```中进行配置

``` json
 "scripts": {
    "build": "webpack --mode=production",
    "dev": "webpack-dev-server --mode=development"
  }
```

5. 安装ts相应的loader：webpack只认识js，(ts/css/image/...)需要告诉它把这些文件交给相应的加载器处理

ts-loader / awesome-ts-loader 二选一

他们依赖typescript，因此在工程下，需要再安装typescript

```js
// webpack.config.js
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
    }
}
```

6. ```tsc --init```新建tsconfig.json文件，进行ts的配置，才能进行ts的编译处理；

遇到的问题：1. 在```index.ts```中导入其他ts文件，打包不通过，提示```Module not found: Error: Can't resolve './myModule' in 'E:\front-develop\ts-react-game\src'```, 也就是说找不到自定义的模块。这里不能将导入语句改为```'./myModule.ts'```, 因为ts编译成js后，这里的字符串时不变的，js是找不到对应的ts文件的，解决方法是再在webpack中进行配置。增加```resolve```配置项:

```js
resolve: {
        extensions: [".ts", ".js"] // 解析模块时，后缀名为ts和js都会查找一下有没有
    }
```

## 游戏开发

- 单一职能原则：每个类只做跟他相关的一件事
- 开闭原则：系统中的类，应该对扩展开放，对修改关闭

基于以上两个原则，系统中使用如下模式：

- 数据-界面分离模式

### 开发过程

1. 小方块类(Square)：他能处理自己的数据，知道什么时候需要显示，但不知道怎么显示；

2. 小方块显示类(SquarePageViewer)：用于实现将一个小方块到页面上

3. 小方块组合类(SquareGroup)：

组合类的属性：

- 中心坐标
- 形状: 由小方块组成的数组
- 颜色

**两个问题**？
该数组的组成能不能发生变化？ 不能！
该数组的元素从何而来？

- 一个方块的组合，取决于组合的形状(一组相对坐标的组合，该组合中有一个特殊坐标，表示形状中心)
- 如果知道：形状、中心点坐标、颜色，就可以设置小方块数组

4. 俄罗斯方块的生产者(Teris)，每一种形状的俄罗斯方块组合都继承自SquareGroup类。
5. 俄罗斯方块的规则类(TerisRule): 规则不是针对某一个俄罗斯块特有的，因此规则都是静态方法。
   1. 包含是否可以移动、旋转、消除
6. 开发旋转功能

旋转的本质：根据当前的形状 -> 新的形状

- 有些方块是不旋转的，有些方块旋转时只有两种状态

rotate方法有一种通用的实现方法，但是不同的情况下，会有不同的实现。因此将SquareGroup作为父类，其他不同形状的方块组合都是他的子类，子类可以重写父类的方法，这里要重写的就是旋转方法。因为某些方块的旋转功能不一样，所以重写。

旋转不能超出边界 

7. 开发游戏类(Game)

Game类清楚什么时候进行显示的切换，但不知道如何显示

因此使用GamePageViewer类实现接口GameViewer，专门用来做界面的显示切换

8. 触底处理(hitBottom)

触底：当前方块到达最底部

什么时候可能发生触底？

- 自动下落
- 玩家控制下落

触底可能发生： 消除方块

消除时做哪些事？

- 界面上移除方块、从exists数组中移除、改变移除方块后 上面方块的y坐标、增加积分

触底之后做什么？(函数如何编写)

- 保存当前的方块
- 消除方块
- 切换方块
- 判断游戏是否结束

新的问题？

- 当触底后，如何保存已落下的方块(定义一个属性exists，用来保存每次触底后的方块)
- 如何根据已保存的方块，判断当前方块是否可以移动(判断移动到的目标坐标是否与已有的方块有重叠)

发现一个问题：**在forEach中， 无法利用return结束循环**

9. 积分(消除时增加积分)
10. 完成游戏界面 (游戏界面在专门用于显示的 GamePageViewer 中实现)

## 总结

为什么要学面向对象

1. 面向对象带来了新的开发方式
   1. 面向对象开发非常成熟，特别善于解决复杂问题
2. TypeScript的某些语法专门为面向对象准备
3. 学习一些设计模式

为什么选择做游戏？

1. 游戏特别容易使用面向对象的思维
