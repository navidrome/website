#!/bin/bash
# Fetch latest charts data from external endpoint
# This script runs before Hugo builds to ensure up-to-date analytics data
#
# In production (HUGO_ENV=production), the script fails if fetch fails.
# In local development, it warns but continues if charts.json already exists.

set -e

OUTPUT_FILE="static/data/charts.json"
IS_PRODUCTION="${HUGO_ENV:-}"

# Helper to handle errors - fail in production, warn in development
handle_error() {
    local message="$1"
    if [ "$IS_PRODUCTION" = "production" ]; then
        echo "Error: $message"
        exit 1
    else
        echo "Warning: $message"
        echo "Continuing without charts data - analytics page may not work"
        exit 0
    fi
}

# Check required environment variables
if [ -z "$CHARTS_URL" ]; then
    handle_error "CHARTS_URL environment variable is not set"
fi

if [ -z "$CHARTS_API_KEY" ]; then
    handle_error "CHARTS_API_KEY environment variable is not set"
fi

echo "Fetching charts data from $CHARTS_URL..."

# Create output directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Fetch data with authentication using wget (curl not available in Hugo Docker image)
TEMP_FILE="${OUTPUT_FILE}.tmp"
if ! wget -q --header="Authorization: Bearer $CHARTS_API_KEY" -O "$TEMP_FILE" "$CHARTS_URL"; then
    rm -f "$TEMP_FILE"
    handle_error "Failed to fetch charts data from $CHARTS_URL"
fi

# Validate that we got valid JSON (basic check - file should start with [ or {)
if ! head -c 1 "$TEMP_FILE" | grep -qE '[\[\{]'; then
    echo "Invalid response received:"
    cat "$TEMP_FILE"
    rm -f "$TEMP_FILE"
    handle_error "Invalid JSON received from charts endpoint"
fi

# Move temp file to final location
mv "$TEMP_FILE" "$OUTPUT_FILE"
echo "Charts data successfully fetched and saved to $OUTPUT_FILE"
