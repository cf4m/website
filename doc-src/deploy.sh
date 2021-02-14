#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn docs:build

# 进入生成的文件夹
cd ../docs

# 如果是发布到自定义域名
echo 'cf4m.enaium.cn' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:cf4m/website.git master

cd -