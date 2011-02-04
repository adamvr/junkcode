#!/bin/sh

progname="`basename $0`"
configfile="~/.mqmonitor"
server="localhost"

Usage() {
    echo >&2 Usage $progname command
    exit 1
}

command="$1"

Publish() {
    mosquitto_pub -t "$progname" -h "$server" -m "$1"
}

F() {
    `which $0`
}



#[ -f "$configfile" ] || echo "You need to make a config file, dolt!"; exit 2

[ $# -ne 2 ] || Usage

sh -c "$1" 2>&1 | mosquitto_pub -h localhost -t "$1" -l
