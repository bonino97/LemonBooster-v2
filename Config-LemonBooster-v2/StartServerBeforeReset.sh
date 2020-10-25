#!/bin/bash

sudo systemctl daemon-reload
sudo systemctl start mongod
sudo systemctl status mongod
pm2 start ~/tools/LemonBooster-v2/API-LemonBooster-v2/Index.js