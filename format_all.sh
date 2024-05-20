#!/bin/bash

# Run formatting script in frontend directory
echo "Formatting frontend..."
(cd frontend && npm run format:fix)

# Run formatting script in backend directory
echo "Formatting backend..."
(cd backend && npm run format)

echo "Formatting completed."
