# 莉莉菈 

（QQ频道机器人）

### 所在频道(拉拉肥；拉拉菲尔)

QQ频道: 拉拉肥; 拉拉菲尔（测试）

QQ群：319833969

您好，莉莉菈为您服务！
- 📕@bot help||帮助 可以查看帮助
- 🐟 道具检索 鱼名 -> 可以查询鱼类
- 👴 @bot /role -> 可以获取身份组
- 👻@bot wls ->list words from db 
- 🕐 @bot dc utterance intent -> 可以添加自定义意图
- 🎗️ @bot aws intent answer -> 可以添加自定义回答 
- 🪐 @bot train -> 可以重新训练NLP
- 📔 @bot pic 搜索名称 -> 可以搜索Pixiv图片
- 📗 @bot dataset 分类名称 [图片,图片, ...] -> 可以添加自定义分类数据集
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
