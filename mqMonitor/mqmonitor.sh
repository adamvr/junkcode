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



#[ -f "$configfile" ] || echo "You need to make a config file, dolt!"; exit 2

[ $# -ne 2 ] || Usage

(sh -c "$1" \
    && Publish "$1 completed successfully" \
    || Publish "$1 failed" \
) 2>/dev/null 1>&2 &
