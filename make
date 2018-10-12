#!/bin/bash
if [ "$(whoami)" != "root" ]; then
    SUDO=sudo
fi
echo "测试环境请使用 make test"
${SUDO} git pull
${SUDO} npm run build $1
${SUDO} rm -rf ./user-pc
${SUDO} mv ./temp ./user-pc