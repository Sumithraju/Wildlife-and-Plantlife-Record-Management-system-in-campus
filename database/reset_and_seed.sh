#!/bin/bash
# Clears all data and re-seeds the database with campus records.
# Run from the project root: bash database/reset_and_seed.sh

set -e

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-wildlife_campus}"
DB_USER="${DB_USER:-wildlife_user}"
export PGPASSWORD="${DB_PASSWORD:-wildlife_pass}"

echo "Resetting and seeding $DB_NAME on $DB_HOST:$DB_PORT ..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$(dirname "$0")/seed.sql"
echo "Done."
