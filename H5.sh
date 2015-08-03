#!/usr/bin/expect
set timeout 30
set src [lindex $argv 0]
spawn rsync -aP -e ssh_bak  $src.zip www@10.1.22.40:/usr/local/webserver/nginx/html/H5
expect "password:"
send "hello123\r"
sleep 3
spawn ssh www@10.1.22.40 unzip -o /usr/local/webserver/nginx/html/H5/$src.zip -d /usr/local/webserver/nginx/html/H5/$src
expect "password:"
send "hello123\r"
interact