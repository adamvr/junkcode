#!/bin/sh

progname="`basename $0`"
configfile="~/.mqmonitor"

Usage() {
    echo >&2 Usage $progname command
    exit 1
}


#[ -f "$configfile" ] || echo "You need to make a config file, dolt!"; exit 2

[ $# -ne 2 ] || Usage

sh -c "${1}" && mosquitto_pub -t "mqmonitor" -m "${1} completed successfully" || mosquitto_pub -t "mqmonitor" -m "${1} failed"
