#!/bin/bash
set -e

mongo <<EOF
use $MONGO_DB
db.events.insertOne({
    id: 0,
    event_name: '$MUNVERSE_EVENT_NAME',
    event_logo_url: '$MUNVERSE_EVENT_URL'
})

db.councils.insertOne({
    id: 0,
    council_name: '$MUNVERSE_COUNCIL_NAME',
    council_logo_url: '$MUNVERSE_COUNCIL_URL'
})
EOF