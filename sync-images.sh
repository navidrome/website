#!/bin/bash

set -e

# Replace <your_access_key> with your Unsplash API access key
ACCESS_KEY="$HUGO_UNSPLASH_ACCESS_KEY"
COLLECTION_ID="$1"

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "Error: cwebp is not installed. Please install webp package first."
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed. Please install jq package first."
    exit 1
fi

# Check if the Unsplash API access key is set
if [ -z "$ACCESS_KEY" ]; then
    echo "Error: Unsplash API access key is not set. Please set the HUGO_UNSPLASH_ACCESS_KEY environment variable."
    exit 1
fi

# Check if the collection ID is provided as an argument
if [ -z "$COLLECTION_ID" ]; then
    echo "Error: Collection ID is not provided. Please provide the collection ID as an argument."
    exit 1
fi

# Initialize variables for pagination
page=1
per_page=30
total_pages=1
image_ids=""

# Get total photos in the collection and calc the total_pages
response=$(curl --silent --request GET "https://api.unsplash.com/collections/${COLLECTION_ID}" \
    --header "Authorization: Client-ID ${ACCESS_KEY}")
total_photos=$(echo "${response}" | jq -r '.total_photos')
total_pages=$((total_photos/30+1))

# Loop through each page of the collection's photos until all photos have been retrieved
while [ $page -le $total_pages ]; do
  # Make a request to the Unsplash API to retrieve the current page of the collection's photos
  response=$(curl --silent --request GET "https://api.unsplash.com/collections/${COLLECTION_ID}/photos?page=${page}&per_page=${per_page}" \
    --header "Authorization: Client-ID ${ACCESS_KEY}")

  # Use jq to extract the image IDs from the response and append them to the existing list
  page_image_ids=$(echo "${response}" | jq -r '.[].id')
  image_ids="${image_ids}
${page_image_ids}"

  page=$((page+1))
done

mkdir -p static/images
echo "---" > static/images/index.yml
new_images=0
new_webp=0

# Download each image in the list to the static/images folder if it doesn't already exist
for id in $image_ids; do
  # Check if the image file exists locally
  if [ ! -f "static/images/${id}.jpg" ]; then
    # If the image file doesn't exist locally, download it from the Unsplash API
    url="https://unsplash.com/photos/${id}/download?fm=jpg&w=1600&h=900&fit=max"
    echo "$url"
    curl -sSL "$url" > static/images/"${id}".jpg
    new_images=$((new_images+1))
  fi
  # Convert to WebP if it doesn't exist yet
  if [ ! -f "static/images/${id}.webp" ]; then
    cwebp -q 80 "static/images/${id}.jpg" -o "static/images/${id}.webp"
    new_webp=$((new_webp+1))
  fi
  echo "- ${id}.jpg" >> static/images/index.yml
done

[ "$new_images" != "0" ] && echo "New images added: $new_images"
[ "$new_webp" != "0" ] && echo "New WebP conversions: $new_webp"