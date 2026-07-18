#!/usr/bin/env bash
set -euo pipefail

source_base="https://ghost-lebanon-store.fine-ridge-5279.chatgpt.site"

assets=(
  "editorial/ghost-duo-cutout.png"
  "editorial/ghost-duo-field.png"
  "editorial/ghost-male-field.png"
  "products/eclipse-veil.png"
  "products/female-ghost-coat.png"
  "products/ghost-cap.png"
  "products/ghost-cassock-detail.png"
  "products/ghost-hoodie.png"
  "products/ghost-necklace.png"
  "products/ghost-pants.png"
  "products/male-ghost-cassock.png"
  "products/shadow-mask.png"
  "products/specter-gloves-leather.png"
  "products/specter-gloves.png"
  "products/vans-old-skool.jpg"
  "products/vans-sk8-hi-alt1.jpg"
  "products/vans-sk8-hi-alt2.jpg"
  "products/vans-sk8-hi.jpg"
)

for asset in "${assets[@]}"; do
  mkdir -p "public/$(dirname "${asset}")"
  curl --fail --location --retry 3 --silent --show-error \
    "${source_base}/${asset}" \
    --output "public/${asset}"
done
