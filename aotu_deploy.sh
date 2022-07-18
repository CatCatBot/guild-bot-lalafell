#!/bin/bash

#拉取代码
git pull

#安装依赖
npm install

#编译
npm run build

#拷贝文件
cp -R src/bot/utils/nsfw/model dist/bot/utils/nsfw/model
cp src/bot/plugins/ffxiv-fish/data/Item.json dist/bot/plugins/ffxiv-fish/data/Item.json

#启动服务
pm2 delete all
pm2 start npm --name lalafellBot -- start