#!/bin/dash
mapfile="map.txt"
[ $# -gt 0 ] && mapfile="$1"

[ -f $mapfile ] || {
  echo "$0: Error: Invalid mapfile '$mapfile'"
  exit 1
}

ground=$(sed 'q\.' !$"$mapfile")