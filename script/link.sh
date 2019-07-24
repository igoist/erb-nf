#!/bin/bash

echo "link $(pwd)/public/css -> $(pwd)/dist/css"
ln -s "$(pwd)/public/css/" "$(pwd)/dist/css"

echo "link $(pwd)/public/img -> $(pwd)/dist/img"
ln -s "$(pwd)/public/img/" "$(pwd)/dist/img"

echo "link $(pwd)/public/font -> $(pwd)/dist/font"
ln -s "$(pwd)/public/font/" "$(pwd)/dist/font"

echo "link $(pwd)/public/map -> $(pwd)/dist/map"
ln -s "$(pwd)/public/map/" "$(pwd)/dist/map"

echo "link $(pwd)/public/music -> $(pwd)/dist/music"
ln -s "$(pwd)/public/music/" "$(pwd)/dist/music"
