#!/bin/bash

#拉取代码
git pull

#安装依赖
npm install

#编译
npm run build

#拷贝文件
cp -R src/bot/utils/nsfw/model dist/bot/utils/nsfw/model
mkdir dist/bot/plugins/ffxiv-fish/data
cp src/bot/plugins/ffxiv-fish/data/Item.json dist/bot/plugins/ffxiv-fish/data/Item.json
mkdir dist/bot/plugins/huajianji/data
cp src/bot/plugins/huajianji/data/* dist/bot/plugins/huajianji/data/
#启动服务
pm2 delete all
pm2 start npm --name lalafellBot -- start