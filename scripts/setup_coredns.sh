#!/bin/bash
# Start CoreDNS with the provided zone file

docker run --rm -p "${DNS_PORT:-8053}:53/udp" -p "${DNS_PORT:-8053}:53/tcp" \
    -v "$(pwd)/Corefile:/Corefile" \
    -v "$(pwd)/db.lan:/db.lan" \
    coredns/coredns:1.12.1 -conf /Corefile
