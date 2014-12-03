#!/bin/bash

# This script shows you how to dump traffic frum our local machine right back to our local machine.
#
# First, you need to get the interface you want to listen on for traffic.  Since we are just
# listening for local traffic, we need the LOOPBACK interface.  Running ifconfig on my machine
# yields:
#
# > ifconfig
#
# lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
#         inet 127.0.0.1  netmask 255.0.0.0
#         ...
#         ...
#
# This means that the following command will dump all local traffic to the terminal:
# (Note that on my machine I needed root permissions to do this)
sudo tcpdump -i lo -X

# If you can't find the local interface, or want to listen on all interfaces, try:
#sudo tcpdump -i any -X
