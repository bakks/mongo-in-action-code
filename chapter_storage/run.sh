#!/bin/bash

export MONGO_DIR=/storage/mongodb
export NUM_LOOPS=16

configs=(
    mmapv1.conf
    wiredtiger-uncompressed.conf
    wiredtiger-snappy.conf
    wiredtiger-zlib.conf
)

cd $MONGO_DIR
for config in "${configs[@]}"; do
    echo "===== RUNNING $config ====="
    echo "Cleaning up data directory"
    DATA_DIR=$(grep dbPath configs/$config | awk -F\" '{ print $2 }')
    rm -rf $MONGO_DIR/$DATA_DIR/*

    echo -ne "Starting up mongod... "
    T="$(date +%s)"
    ./bin/mongod --config configs/$config &

    # wait for mongo to start
    while [ 1 ]; do
        ./bin/mongostat -n 1 > /dev/null 2>&1
        if [ "$?" -eq 0 ]; then
            break
        fi    
        sleep 2
    done
    T="$(($(date +%s)-T))"
    echo "took $T seconds"

    T="$(date +%s)"
    for l in $(seq 1 $NUM_LOOPS); do
        echo -ne "\rRunning import loop $l"
        ./bin/mongo benchmark --quiet --eval 'load("./insert.js")' >/dev/null 2>&1
    done
    T="$(($(date +%s)-T))"

    echo
    echo "Insert performance for $config: $T seconds"

    echo -ne "Shutting down server... "
    T="$(date +%s)"
    ./bin/mongo admin --quiet --eval "db.shutdownServer({force: true})" >/dev/null 2>&1

    while [ 1 ]; do
        pgrep -U $USER mongod > /dev/null 2>&1
        if [ "$?" -eq 1 ]; then
            break
        fi    
        sleep 1
    done
    T="$(($(date +%s)-T))"
    echo "took $T seconds"

    SIZE=$(du -s --block-size=1 $MONGO_DIR/$DATA_DIR | cut -f1)
    SIZE_MB=$(echo "scale=2; $SIZE/(1024*1024)" | bc)
    echo "Disk usage for $config: ${SIZE_MB}MB"
done


