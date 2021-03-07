# yarn-resolutions

基于 yarn 自动收集依赖冲突，可视化给出 resolutions 建议，以此得到产物减小的收益

_version: 1.0.0_

- 为什么要使用 yarn resolutions ？

[《 活用 yarn resolutions 统一版本大幅减小产物包体积 》](https://blog.csdn.net/qq_21567385/article/details/112644629)

### 安装

```bash
    yarn global add yarn-resolutions
```

### 使用

在项目根目录执行：

```bash
  yarn-resolutions
```

即可得到可视化分析结果（[示例](https://fz6m.github.io/yarn-resolutions/)）：

![](https://cdn.jsdelivr.net/gh/fz6m/Private-picgo@moe/img/20210307084644.png)

### 分析

通常来说我们在意的是某依赖被打入了几份，他们的版本号是什么，在可视化报告中，你可以得到这些信息。

在经过谨慎评估选择依赖的版本后，将 `resolutions` 建议复制到 `package.json` 中，之后执行 `yarn` 重新安装依赖即可解决版本冲突，得到收益。

### 选项

```bash
Usage: yarn-resolutions [options]

Options:
  -m, --mode [mode]  filter version rules (default: "major")
  --no-mode          not filter the version
  -p, --path <path>  yarn.lock file path (default: "./yarn.lock")
  -r, --report       automatically open the conflict result web page (default: true)
  --no-report        not report results
  -a, --auto         automatically give resolutions suggestions in package.json (default: false)
  -v, --version      output the current version
  -h, --help         display help for command
```

说明：

|   name   |    default    | required | description                                                                                                                    |
| :------: | :-----------: | :------: | :----------------------------------------------------------------------------------------------------------------------------- |
|  `mode`  |    `major`    |    no    | 过滤冲突依赖的版本规则，默认为大版本过滤，即只报告无大版本差异的冲突，这将避免一些 BREAKING CHANGE ，可置为 `minor` 过滤次版本 |
|  `path`  | `./yarn.lock` |    no    | `yarn.lock` 文件位置                                                                                                           |
| `report` |    `true`     |    no    | 是否生成可视化报告                                                                                                             |
|  `auto`  |    `false`    |    no    | 是否自动在 `package.json` 生成 resolutions 建议                                                                                |

### 作为依赖使用

```bash
  yarn add -D yarn-resolutions
```

例：

```js
  const { run } = require('yarn-resolutions')

  run({
    mode: 'major',
    path: './yarn.lock',
    report: true,
    auto: false
  })
```

### 注意

1. 应该谨慎评估使用 resolutions 锁定的依赖，而不是无脑复制使用，通常我们针对易发生冲突的大型依赖（ 如 lodash 等 ）进行锁定版本，他们在不同版本间不会发生 BREAKING CHANGE ，你可以通过可视化分析插件 [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 分析产物中各个依赖大小。

2. 每次使用 resolutions 字段锁定依赖后执行 `yarn` 重新安装依赖才会使锁定版本生效。
