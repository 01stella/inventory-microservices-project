#!/bin/bash
# Script to enter the PostgreSQL & MongoDB databases using Docker

if [ "$1" == "postgres" ]; then
    echo "Entering PostgreSQL database..."
    docker exec -it postgres_db psql -U admin -d inventory
elif [ "$1" == "mongodb" ]; then
    echo "Entering MongoDB database..."
    docker exec -it mongodb_logs mongo --host mongodb_logs --port 27017 -u admin -p secretpassword --authenticationDatabase admin
else
    echo "Invalid command!"
    echo "Use: ./db.sh pg (to enter PostgreSQL) or ./db.sh mongo (to enter MongoDB)"
fi