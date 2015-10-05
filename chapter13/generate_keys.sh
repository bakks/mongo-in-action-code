#!/bin/bash

# Helper script to generate a PEM file for use in basic SSL encryption in MongoDB

# Generate a PEM file
openssl req -newkey rsa:2048 -new -x509 -days 365 -nodes -out mongodb-cert.crt -keyout mongodb-cert.key
cat mongodb-cert.key mongodb-cert.crt > mongodb.pem

# Display information about the certificate we just generated
openssl x509 -text -noout -in mongodb.pem
