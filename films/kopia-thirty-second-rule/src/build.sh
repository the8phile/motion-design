#!/bin/sh
# Assembles index.html from the parts in src/ (edit the parts, then run: sh src/build.sh)
cd "$(dirname "$0")/.."
{
  cat src/00-head.html
  echo '<script>'
  cat src/10-lib.js src/20-scenes.js src/30-timeline.js
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > index.html
echo "index.html: $(wc -c < index.html) bytes"
