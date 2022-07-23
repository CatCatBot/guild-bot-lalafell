# 莉莉菈 

QQ频道机器人

![pongpongpong](./building.gif)

### 所在频道(拉拉肥；拉拉菲尔)

QQ频道: 拉拉肥; 拉拉菲尔（测试）

点击加入QQ频道【[拉拉肥](https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=3XQuR&businessType=9&from=181074&biz=ka&shareSource=5)】

QQ群：319833969

您好，莉莉菈为您服务！
- 📕 @bot help||帮助 可以查看帮助
- 🌱 @bot 名片 帮助 -> 可以查看名片相关帮助
- ♥ @bot 随机拉拉肥 随机猫猫 || 私信bot 随机拉拉肥 随机猫猫  可以获取随机图
- 🌸 @bot 花间集 可以获取随机花间集的诗词
- 🐟 道具检索 鱼名 -> 可以查询鱼类
- 👴 @bot /role -> 可以获取身份组
- 🕐 @bot dc utterance intent -> 可以添加自定义意图
- 🎗️ @bot aws intent answer -> 可以添加自定义回答 
- 🪐 @bot train -> 可以重新训练NLP
- 📔 @bot pic 搜索名称 -> 可以搜索Pixiv图片
- 📗 @bot dataset 分类名称 [图片,图片, ...] -> 可以添加自定义分类数据集
# TODO
- 

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
ffxiv-fish 使用了[ffxiv-datamining-cn](https://github.com/thewakingsands/ffxiv-datamining-cn)数据。

huajianji 使用了[chinese-poetry](https://github.com/chinese-poetry/chinese-poetry)数据。

随机拉拉肥 随机猫猫 图片来自[eorzeacollection](https://ffxiv.eorzeacollection.com/)。
