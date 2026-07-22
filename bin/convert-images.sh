#!/usr/bin/env bash

# This script will convert all jpg and png images to webp within the assets folder

set -e

cd "$(dirname "$0")/.."

echo "==> Finding jpg, jpeg and png images and converting to webp"

find -E . -regex '.*/assets/.*/.*\.(jpg|jpeg|png)' | parallel -eta cwebp {} -o {.}.webp

echo "==> Yay! all done."
