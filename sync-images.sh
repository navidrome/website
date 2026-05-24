#!/bin/bash

set -e

# Replace <your_access_key> with your Unsplash API access key
ACCESS_KEY="$HUGO_UNSPLASH_ACCESS_KEY"
COLLECTION_ID="$1"

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

# Temporary file to store image data (id and raw URL)
tmp_file=$(mktemp)
trap "rm -f $tmp_file" EXIT

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

  # Use jq to extract the image ID and raw URL, output as tab-separated values
  echo "${response}" | jq -r '.[] | "\(.id)\t\(.urls.raw)"' >> "$tmp_file"

  page=$((page+1))
done

mkdir -p static/images
echo "---" > static/images/index.yml
new_images=0

# Download each image in the list to the static/images folder if it doesn't already exist
while IFS=$'\t' read -r id raw_url; do
  [ -z "$id" ] && continue
  
  # Check if the webp file exists locally
  if [ ! -f "static/images/${id}.webp" ]; then
    # Build the webp URL from the raw URL (add format and size parameters)
    webp_url="${raw_url}&fm=webp&w=1600&h=900&fit=max&q=80"
    echo "Downloading ${id}..."
    curl -sSL "$webp_url" > static/images/"${id}".webp
    new_images=$((new_images+1))
  fi
  echo "- ${id}.jpg" >> static/images/index.yml
done < "$tmp_file"

[ "$new_images" != "0" ] && echo "New images added: $new_images"