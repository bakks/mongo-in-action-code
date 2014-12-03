#!/bin/bash

# Examples of how to run with SSL encryption in 2.6

# Server
mongod --sslMode requireSSL --sslPEMKeyFile mongodb.pem

# Client
mongo --ssl
