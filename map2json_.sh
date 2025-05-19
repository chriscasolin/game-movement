#!/bin/dash
mapfile="map.txt"
[ $# -gt 0 ] && mapfile="$1"

[ -f $mapfile ] || {
  echo "$0: Error: Invalid mapfile '$mapfile'"
  exit 1
}

echo "["
sed -E 's/(.)/"\1", /g' map.txt | sed -E 's/\, $//g' | sed -E 's/(.*)/  [ \1 ],/' | sed -E '$ s/.$//'
echo "\n]"