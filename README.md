# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
 

# 本地调试
1. 新建@ku/schematics工程，并配置好功能
2. 在@ku/schematics工程下执行 npm link，发布@ku/schematics到本地（需要本地管理员权限）
3. 使用@ku/schematics

```BASH
ng new kudemo --skip-install --style=less  #新建项目的依赖包版本可能不一致，故此处先不下载安装npm packages；  LESS依赖问题
cd kudemo
npm link @ku/schematics #连接本地的@ku/schematics
schematics  @ku/schematics:kuAdd #执行@ku/schematics的kuAdd脚本，修改项目
# schematics  @ku/schematics:see 用于测试路径是否正常
```

# 发布到nexus仓库

```BASH
npm run build #编译最新的源文件
npm publish  --registry=http://repo.chinacscs.com:8081/repository/npm_internal/ #发布
```

# 使用说明

使用ku-schematics
```BASH
ng new kudemo --skip-install --style=less  #新建项目的依赖包版本可能不一致，故此处先不下载安装npm packages；  LESS依赖问题
cd kudemo
ng add @ku/schematics #等价于同时执行npm install @ku/schematics && schematics  @ku/schematics:kuAdd

```
