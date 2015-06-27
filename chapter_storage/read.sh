#!/bin/bash

export MONGO_DIR=/storage/mongodb
export NUM_LOOPS=16

configs=(
    mmapv1.conf
    wiredtiger-uncompressed.conf
    wiredtiger-snappy.conf
    wiredtiger-zlib.conf
)

sudo echo "Acquired root permissions"

cd $MONGO_DIR
for config in "${configs[@]}"; do
    echo "===== RUNNING $config ====="
    echo "Clearing memory caches"
    sync
    echo 3 | sudo tee /proc/sys/vm/drop_caches

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

    rm -f timings-${config}.txt
    T="$(date +%s)"
    for l in $(seq 1 $NUM_LOOPS); do
        echo -ne "\rRunning read loop $l"
        /usr/bin/time -f "%e" -o timings-${config}.txt -a --quiet ./bin/mongo benchmark --quiet read.js >/dev/null 2>&1
    done
    T="$(($(date +%s)-T))"

    echo
    echo "Read performance for $config: $T seconds"

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
done
