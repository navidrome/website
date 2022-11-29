#!/bin/bash

set -e

mkdir -p static/images
rm -rf static/images/*

echo "---" > static/images/index.yml
for i in `cat background_images.txt`; do
    url="https://unsplash.com/photos/${i}/download?fm=jpg&w=1600&h=900&fit=max"
    echo $url
    curl -sSL $url > static/images/${i}.jpg
    echo "- ${i}.jpg" >> static/images/index.yml
done
