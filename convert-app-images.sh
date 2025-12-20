#!/bin/bash

set -e

# Convert app images to WebP with max dimension of 1200px
# Usage: ./convert-app-images.sh [app-name]
# If no app-name is provided, converts all apps

MAX_SIZE=1200
QUALITY=80

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "Error: cwebp is not installed. Please install webp package first."
    exit 1
fi

# Check if sips is installed (macOS image processing tool)
if ! command -v sips &> /dev/null; then
    echo "Error: sips is not installed (required for macOS)."
    exit 1
fi

# Check if yq or sed is available for YAML editing
YAML_EDITOR=""
if command -v sed &> /dev/null; then
    YAML_EDITOR="sed"
fi

update_yaml() {
    local yaml_file="$1"
    local old_name="$2"
    local new_name="$3"
    
    if [ ! -f "$yaml_file" ]; then
        return
    fi
    
    # Use sed to replace the old filename with new filename in YAML
    if [ "$YAML_EDITOR" = "sed" ]; then
        sed -i '' "s|$old_name|$new_name|g" "$yaml_file"
        echo "  ✓ Updated $yaml_file: $old_name → $new_name"
    fi
}

convert_image() {
    local input_file="$1"
    local output_file="${input_file%.*}.webp"
    local temp_file="${input_file}.resized.tmp"
    
    # Get image dimensions first
    width=$(sips -g pixelWidth "$input_file" | tail -n1 | awk '{print $2}')
    height=$(sips -g pixelHeight "$input_file" | tail -n1 | awk '{print $2}')
    
    # Get the larger dimension
    max_dimension=$width
    if [ "$height" -gt "$width" ]; then
        max_dimension=$height
    fi
    
    # Skip ONLY if already webp AND smaller than MAX_SIZE
    if [[ "$input_file" == *.webp ]] && [ "$max_dimension" -le "$MAX_SIZE" ]; then
        echo "  ⊘ Skipping $input_file (${width}x${height}) - already WebP and smaller than ${MAX_SIZE}px"
        return
    fi
    
    # If already webp but too large, resize it in place
    if [[ "$input_file" == *.webp ]]; then
        echo "  → Resizing $input_file (${width}x${height})"
        sips -Z "$MAX_SIZE" "$input_file" --out "$temp_file" > /dev/null 2>&1
        mv "$temp_file" "$input_file"
        echo "  ✓ Resized $input_file"
        return
    fi
    
    # For non-webp files: check if output already exists
    if [ -f "$output_file" ]; then
        echo "  ✓ $output_file already exists, skipping"
        return
    fi
    
    # Process non-webp image
    if [ "$max_dimension" -gt "$MAX_SIZE" ]; then
        echo "  → Resizing and converting $input_file (${width}x${height})"
        sips -Z "$MAX_SIZE" "$input_file" --out "$temp_file" > /dev/null 2>&1
        cwebp -q "$QUALITY" "$temp_file" -o "$output_file" > /dev/null 2>&1
        rm "$temp_file"
    else
        echo "  → Converting $input_file (${width}x${height})"
        cwebp -q "$QUALITY" "$input_file" -o "$output_file" > /dev/null 2>&1
    fi
    
    echo "  ✓ Created $output_file"
    
    # Update index.yaml if it exists
    local app_dir=$(dirname "$input_file")
    local yaml_file="$app_dir/index.yaml"
    local old_filename=$(basename "$input_file")
    local new_filename=$(basename "$output_file")
    
    update_yaml "$yaml_file" "$old_filename" "$new_filename"
    
    # Remove the original file after successful conversion
    rm "$input_file"
    echo "  ✓ Removed original file $input_file"
}

process_app() {
    local app_name="$1"
    local app_dir="assets/apps/$app_name"
    
    if [ ! -d "$app_dir" ]; then
        echo "Error: App directory not found: $app_dir"
        return 1
    fi
    
    echo "Processing app: $app_name"
    
    # Find all image files (png, jpg, jpeg)
    local image_count=0
    while IFS= read -r -d '' image; do
        convert_image "$image"
        image_count=$((image_count + 1))
    done < <(find "$app_dir" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -print0)
    
    if [ "$image_count" -eq 0 ]; then
        echo "  No images found in $app_name"
    fi
    
    echo ""
}

# Main execution
if [ -n "$1" ]; then
    # Process single app
    process_app "$1"
else
    # Process all apps
    echo "Converting all app images to WebP format..."
    echo "Max dimension: ${MAX_SIZE}px, Quality: ${QUALITY}"
    echo ""
    
    for app_dir in assets/apps/*/; do
        app_name=$(basename "$app_dir")
        # Skip template
        if [ "$app_name" != "_template" ]; then
            process_app "$app_name"
        fi
    done
    
    echo "Done!"
fi
