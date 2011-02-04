#!/bin/sh

progname=`basename $0`
tmpfile=/tmp/filemonitor$RANDOM

Usage() {
    echo $progname file; exit 1
}

DoesntExist() {
    echo "$1 does not exist"; exit 2
}

[ $# -eq 1 ] || Usage
[ -f $1 ] || DoesntExist $1

cp $1 $tmpfile
while true
do
    if [ `find $1 -mtime -2s` ]
    then
	d="`diff $1 $tmpfile`"
	echo $d 2>&1 | mosquitto_pub -h localhost -t "`basename $1`" -s
	cp $1 $tmpfile
    fi
    sleep 1
done
