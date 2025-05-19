#!/usr/bin/env python3

import sys
import json

if len(sys.argv) > 1:
  mapfile = sys.argv[1]
else:
  mapfile = 'map.txt'

from collections import defaultdict

def codeToName(code):
  if code == 'G': return 'grass'
  if code == 'S': return 'stone'
  if code == 'T': return 'tree'
  if code == 'X': return 'barrier'

  return 'unknown'

map = {
  "tiles": defaultdict(lambda: defaultdict(lambda: {})),
  "size": {
    "x": None,
    "y": None
  },
  "position": {
    "x": None,
    "y": None
  }
}

locations = ["ground", "object"]
location = locations.pop(0)

try:
  with open(mapfile, 'r') as f:
    posX, posY = (int(n) for n in f.readline().strip().split())
    map["position"]["x"] = posX
    map["position"]["y"] = posY
    y = 0
    for line in f.readlines():
      if line.startswith('.'):
        location = locations.pop(0)
        y = 0
        continue
      else:
        for x, code in enumerate(line.strip()):
          key = f"{x}_{y}"
          if code.strip():
            map["tiles"][key][location] = { "type": codeToName(code)}
      y += 1

except FileNotFoundError:
  print(f"{sys.argv[0]}:", "Error:", f"File '{mapfile}' does not exist")
  sys.exit(1)

map["size"]["x"] = x + 1
map["size"]["y"] = y

print(json.dumps(map, indent=2, sort_keys=False))