# 莉莉菈

莉莉菈 为您服务。

# TODO
- 莉莉菈人格构建

## 使用技术
使用typescript编写的nodejs项目。
- [nestjs](https://github.com/nestjs/nest)
- [typeorm](https://github.com/typeorm/typeorm) 
- [node-sqlite3](https://github.com/TryGhost/node-sqlite3)
- [bot-node-sdk](https://github.com/tencent-connect/bot-node-sdk)

## 目录结构

```
.
├── dist
│   | ...打包后文件
├── package.json
├── README.md
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── bot
│   │   ├── config // 配置文件
│   │   │   ├── dataSource.ts
│   │   │   ├── lalafell.config.ts
│   │   │   └── s.config.ts
│   │   ├── core //插件加载
│   │   │   └── core.ts
│   │   ├── entities // 实体类
│   │   │   └── message.ts
│   │   ├── ext // 消息接口扩展
│   │   │   └── post.ts
│   │   └── plugins // 插件
│   │       ├── ffxiv-fish
│   │       └── role-play
│   └── main.ts // 消息转发
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```
## 部署
```language = bash
npm run build
```
生成dist文件夹

可以使用pm2 进行部署
```language = bash
pm2 start npm --name lalafellBot -- start
```
## 感谢
ffxiv-fish使用了[此项目](https://github.com/thewakingsands/ffxiv-datamining-cn)数据。
