#!/bin/sh

progname=`basename $0`
tmpfile=/tmp/filemonitor$RANDOM
pollperiod=5

Usage() {
    echo Usage: $progname file; exit 1
}

DoesntExist() {
    echo "$1 does not exist"; exit 2
}

[ $# -eq 1 ] || Usage
[ -f $1 ] || DoesntExist $1

cp -f $1 $tmpfile
while true
do
    if [ `find $1 -mtime -${pollperiod}s` ]
    then
	diff -u $tmpfile $1 | mosquitto_pub -h localhost -t "`basename $1`" -s
	cp $1 $tmpfile
    fi
    sleep ${pollperiod}
done
