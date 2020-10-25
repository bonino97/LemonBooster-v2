#!/bin/bash

sudo systemctl daemon-reload
sudo systemctl start mongod
sudo systemctl status mongod
pm2 delete 0
cd ~/tools/LemonBooster-v2/API-LemonBooster-v2
npm install --save dotenv
pm2 start ~/tools/LemonBooster-v2/API-LemonBooster-v2/Index.js
pm2 logs