#!/bin/bash

sudo systemctl daemon-reload
sudo systemctl start mongod
sudo systemctl status mongod
cd ~/tools/LemonBooster-v2/API-LemonBooster-v2
npm install --save dotenv
pm2 start ~/tools/LemonBooster-v2/API-LemonBooster-v2/Index.js