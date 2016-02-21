#!/bin/sh

set -e
usage() {
cat <<EOF
Usage: serve.sh [options...]
Options:
  -h, --help, ?       Shows this dialog.
  -p, --port          Port on which the server will listen for requests. Default is 4040
  -a, --address       The server address. Default is 0.0.0.0
EOF
}

error() {
    printf "\e[31mERROR:\e[m %-6s\n" "$1" >&2
}

ADDR=0.0.0.0
PORT=4040;
BIN=`which php`

for key in "$@"; do
    key="$1"
    case $key in
        --help|-h|\?)
        usage
        exit 0
        ;;
        --port|-p)
        PORT=$2
        shift 2
        continue
        ;;
        --address|-a)
        ADDR=$2
        shift 2
        continue
        ;;
        *)
        if test $key; then
            echo "Invalid argument $key"
            exit 1
        fi
        break
        ;;
esac
    shift
done

if test $1; then
    PORT=$1;
fi

if [[ ! -f $bin ]]; then
    BIN="php"
fi

$BIN -S $ADDR:$PORT -t public public/index.php
