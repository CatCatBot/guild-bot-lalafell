#!/bin/bash

#拉取代码
git pull

#安装依赖
npm install

#编译
npm run build

#拷贝文件
cp -r src/bot/utils/nsfw model/ ./dist/bot/utils/nsfw/model/
cp src/plugins/ffixv-fish/data/item.json ./dist/plugins/ffixv-fish/data/item.json

#启动服务
pm2 delete all
pm2 start npm --name lalafellBot -- start