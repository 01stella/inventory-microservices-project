#!/bin/bash
# Script to enter the PostgreSQL & MongoDB databases using Docker
COMMAND=$(echo "$1" | tr -d '\r' | xargs)


case "$COMMAND" in
  "postgres"|"pg")
    echo "----------------------------------------------------"
        echo "ENTERING POSTGRESQL (inventory database)"
        echo "To exit the database: Type '\q' and press Enter"
        echo "----------------------------------------------------"
        
        docker exec -it postgres_db psql -U admin -d inventory -c "\pset pager off" -c "SELECT * FROM items;" -c "\q"
        docker exec -it postgres_db psql -U admin -d inventory
        ;;

    "mongo")
        echo "----------------------------------------------------"
        echo "ENTERING MONGODB (Logs Database)"
        echo "To exit: Type 'exit' or press Ctrl+C"
        echo "----------------------------------------------------"
        
        docker exec -it mongodb_db mongosh inventory_logs --shell --eval "console.log('--- RECENT API LOGS ---'); printjson(db.api_logs.find().sort({_id:-1}).limit(5).toArray()); console.log('-----------------------');"
        ;;
esac