#!/bin/bash
if [ "$(whoami)" != "root" ]; then
    SUDO=sudo
fi
echo "测试环境请使用 make test"
${SUDO} git pull
${SUDO} npm run build $1
${SUDO} rm -rf ./pch5
${SUDO} mv ./temp ./pch5