#!/bin/bash

echo "Updating Packages..."

sudo apt-get -y update
sudo apt-get -y upgrade

echo "Installing GNUPG..."
sudo apt-get install gnupg

echo "Importing MongoDB public GPG Key..."
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

echo "Reloading packages..."
sudo apt-get update

echo "Installing MongoDB..."
sudo apt-get install -y mongodb-org

echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections

echo "Reloading services..."
sudo systemctl daemon-reload

echo "Start MongoDB"
sudo systemctl start mongod

echo "Verifying if MongoDB is installed..."
sudo systemctl status mongod

echo "Appliying auto-start for reboot system error..."
sudo systemctl enable mongod