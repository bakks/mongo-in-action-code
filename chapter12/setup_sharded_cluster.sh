#!/bin/bash
set -e

echo
echo "##################################################"
echo "# MongoDB In Action Sharded Cluster Setup Script #"
echo "##################################################"
echo
echo This script sets up the example sharded cluster from Chapter 11 of MongoDB in
echo Action Second Edition.  It only runs on unix systems, and assumes there is
echo a directory called \"data\" in the current directory, so before running
echo this script run:
echo
echo mkdir ./data
echo
echo You can kill all the processes when you are done by running:
echo
echo killall mongod mongos
echo
echo To cleanup the data being used, just delete the "data" directory
echo

# NOTE: All commands running using the "--eval" option to the mongo shell are
# wrapped in "printjson".  This is not necessary when using the shell in
# interactive mode, since return values of commands get printed automatically.

# The hostname of the local machine that we are running our cluster on.  If this
# doesn't work, try changing this to "localhost"
if [ -z $HOSTNAME ]
then
    HOSTNAME=`hostname`
fi



echo
echo "#####################"
echo "# Setting up Shards #"
echo "#####################"
echo



echo Creating all the data directories for the nodes in the Shard A replica set
mkdir ./data/rs-a-1
mkdir ./data/rs-a-2
mkdir ./data/rs-a-3

echo Creating all the data directories for the nodes in the Shard B replica set
mkdir ./data/rs-b-1
mkdir ./data/rs-b-2
mkdir ./data/rs-b-3



echo Starting all the mongod nodes in the Shard A replica set
mongod --shardsvr --replSet shard-a --dbpath ./data/rs-a-1 --port 30000 \
       --logpath ./data/rs-a-1.log --fork
mongod --shardsvr --replSet shard-a --dbpath ./data/rs-a-2 --port 30001 \
       --logpath ./data/rs-a-2.log --fork
mongod --shardsvr --replSet shard-a --dbpath ./data/rs-a-3 --port 30002 \
       --logpath ./data/rs-a-3.log --fork

echo Starting all the mongod nodes in the Shard B replica set
mongod --shardsvr --replSet shard-b --dbpath ./data/rs-b-1 --port 30100 \
       --logpath ./data/rs-b-1.log --fork
mongod --shardsvr --replSet shard-b --dbpath ./data/rs-b-2 --port 30101 \
       --logpath ./data/rs-b-2.log --fork
mongod --shardsvr --replSet shard-b --dbpath ./data/rs-b-3 --port 30102 \
       --logpath ./data/rs-b-3.log --fork



echo Initializing the Shard A replica set
mongo $HOSTNAME:30000 --eval "printjson(rs.initiate())"
echo Waiting for the initialization to complete
sleep 60
echo Adding data node to replica set
mongo $HOSTNAME:30000 --eval "printjson(rs.add(\"$HOSTNAME:30001\"))"
echo Adding arbiter to replica set
mongo $HOSTNAME:30000 --eval "printjson(rs.addArb(\"$HOSTNAME:30002\"))"

echo Initializing the Shard B replica set
mongo $HOSTNAME:30100 --eval "printjson(rs.initiate())"
echo Waiting for the initialization to complete
sleep 60
echo Adding data node to replica set
mongo $HOSTNAME:30100 --eval "printjson(rs.add(\"$HOSTNAME:30101\"))"
echo Adding arbiter to replica set
mongo $HOSTNAME:30100 --eval "printjson(rs.addArb(\"$HOSTNAME:30102\"))"



echo
echo "#############################"
echo "# Setting up Config Servers #"
echo "#############################"
echo



echo Creating all the data directories for the config server nodes
mkdir ./data/config-1
mkdir ./data/config-2
mkdir ./data/config-3



echo Starting all the mongod config server nodes
mongod --configsvr --dbpath ./data/config-1 --port 27019 \
       --logpath ./data/config-1.log --fork
mongod --configsvr --dbpath ./data/config-2 --port 27020 \
       --logpath ./data/config-2.log --fork
mongod --configsvr --dbpath ./data/config-3 --port 27021 \
       --logpath ./data/config-3.log --fork
echo Waiting for config servers to finish starting up
sleep 60



echo
echo "############################"
echo "# Setting up Mongos Router #"
echo "############################"
echo



echo Starting mongos router process
mongos --configdb $HOSTNAME:27019,$HOSTNAME:27020,$HOSTNAME:27021 \
       --logpath ./data/mongos.log --fork --port 40000



echo
echo "############################"
echo "# Initializing the cluster #"
echo "############################"
echo



echo Adding Shard A to the cluster
mongo $HOSTNAME:40000 \
    --eval "printjson(sh.addShard(\"shard-a/$HOSTNAME:30000,$HOSTNAME:30001\"))"

echo Adding Shard B to the cluster
mongo $HOSTNAME:40000 \
    --eval "printjson(sh.addShard(\"shard-b/$HOSTNAME:30100,$HOSTNAME:30101\"))"
