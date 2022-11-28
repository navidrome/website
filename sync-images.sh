#!/bin/bash

mkdir -p static/backgrounds
rm -rf static/backgrounds/*

for i in `cat static/images`; do
    url="https://unsplash.com/photos/${i}/download?fm=jpg&w=1600&h=900&fit=max"
    echo $url
    curl -sSL $url > static/backgrounds/${i}.jpg
done