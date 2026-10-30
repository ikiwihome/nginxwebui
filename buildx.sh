#!/usr/bin/env bash

## 需要安装好docker，并登陆docker login
## 需要安装好docker-buildx：https://docs.docker.com/engine/install/ubuntu/
## 如需自动推送readme至dockerhub，需要安装docker-pushrm：https://github.com/christian-korneck/docker-pushrm
## Dockerfile同目录下运行此脚本
## Docker 构建阶段会使用 docker-maven-settings.xml 配置的 Maven 镜像源

set -e -o pipefail

## 基本信息
repo="ikiwicc/nginxwebui"
arch="linux/amd64"
ver=$(cat pom.xml | grep -A1 nginxwebui | grep version | grep -oP "\d+\.\d+\.\d+")
echo "构建镜像：$repo"
echo "构建架构：$arch"
echo "构建版本：$ver"

## 准备跨平台构建环境
echo "准备跨平台构建环境"
docker pull tonistiigi/binfmt
docker run --privileged --rm tonistiigi/binfmt --install all
docker buildx create --name builder --use 2>/dev/null || docker buildx use builder
docker buildx inspect --bootstrap

## 多平台镜像同时构建并推送
echo "构建镜像并推送至Docker Hub"
docker buildx build \
    --cache-from "type=local,src=/tmp/.buildx-cache" \
    --cache-to "type=local,dest=/tmp/.buildx-cache" \
    --platform "$arch" \
    --tag ${repo}:${ver} \
    --tag ${repo}:latest \
    --push \
    .

