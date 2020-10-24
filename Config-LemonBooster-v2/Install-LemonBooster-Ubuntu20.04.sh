#!/bin/bash

echo "Updating..."

sudo apt-get -y update
sudo apt-get -y upgrade

echo "Installing necessary libraries..."

sudo apt-get install -y libcurl4-openssl-dev
sudo apt-get install -y libssl-dev
sudo apt-get install -y jq
sudo apt-get install -y ruby-full
sudo apt-get install -y libcurl4-openssl-dev libxml2 libxml2-dev libxslt1-dev ruby-dev build-essential libgmp-dev zlib1g-dev
sudo apt-get install -y build-essential libssl-dev libffi-dev python-dev
sudo apt-get install -y python-setuptools
sudo apt-get install -y libldns-dev
sudo apt-get install -y python3-pip
sudo apt-get install -y python-pip
sudo apt-get install -y python-dnspython
sudo apt-get install -y git
sudo apt-get install -y rename
sudo apt-get install -y xargs
sudo apt-get install -y snapd
sudo apt-get install -y wget
sudo apt-get install -y perl
sudo apt-get install -y rustc
sudo apt-get install -y make
sudo apt-get install -y nodejs
sudo apt-get install -y chromium-browser
sudo apt-get install -y libssl1.0-dev
sudo apt-get install -y nodejs-dev
sudo apt-get install -y node-gyp
sudo apt-get install -y npm

npm install -g pm2 

echo "Installing GNUPG..."
sudo apt-get install -y gnupg

echo "Importing MongoDB public GPG Key..."
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

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

#Installing GO.

if [[ -z "$GOPATH" ]];then
	echo "Installing GOlang..."
	wget https://dl.google.com/go/go1.14.2.linux-amd64.tar.gz
	sudo tar -xvf go1.14.2.linux-amd64.tar.gz
	sudo mv go /usr/local
	export GOROOT=/usr/local/go
	export GOPATH=$HOME/go
	export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
	echo 'export GOROOT=/usr/local/go' >> ~/.bash_profile
	echo 'export GOPATH=$HOME/go'	>> ~/.bash_profile
	echo 'export PATH=$GOPATH/bin:$GOROOT/bin:$PATH' >> ~/.bash_profile	
	source ~/.bash_profile
	sleep 1
	break
fi

#Create a recon folder in ~/
mkdir ~/recon

#Create a tools folder in ~/
mkdir ~/tools
cd ~/tools/

#Install Aquatone
echo "Installing Aquatone..."
go get github.com/michenriksen/aquatone
echo "Done!"

#Install Subjack
echo "Installing Subjack..."
go get github.com/haccer/subjack
echo "Done!"

#Install Gobuster
echo "Installing Gobuster..."
go get github.com/OJ/gobuster
echo "Done!"

#Install Gau
echo "Installing Gau..."
GO111MODULE=on go get -u -v github.com/lc/gau
echo "Done!"

#Install Hakcheckurl
echo "Installing Hakcheckurl..."
go get github.com/hakluke/hakcheckurl
echo "Done!"

#Install Hakrawler
echo "Installing Hakrawler..."
go get github.com/hakluke/hakrawler
echo "Done!"

#Install GoSpider
echo "Installing GoSpider..."
go get -u github.com/jaeles-project/gospider
echo "Done!"

#Install getJS
echo "Installing GetJS..."
go get github.com/003random/getJS
echo "Done!"

#Install Assetfinder
echo "Installing Assetfinder..."
go get -u github.com/tomnomnom/assetfinder
echo "Done!"

#Install Chromium
echo "Installing Chromium..."
sudo snap install chromium
echo "Done!"

#Install Dirsearch
echo "Installing Dirsearch..."
git clone https://github.com/maurosoria/dirsearch.git
cd ~/tools/
echo "Done!"

#Install Httprobe
echo "Installing Httprobe..."
go get -u github.com/tomnomnom/httprobe 
echo "Done!"

#Install AWSCLI
echo "Installing AWSCli..."
sudo apt install -y awscli
echo "Don't forget to set up AWS credentials!"
echo "Done!"

#Install massdns
echo "Installing massdns..."
git clone https://github.com/blechschmidt/massdns.git
cd ~/tools/massdns
make
cd ~/tools/
echo "Done!"

#Install ASNLookup
echo "Installing ASNLookup..."
git clone https://github.com/yassineaboukir/asnlookup.git
cd ~/tools/asnlookup
pip install -r requirements.txt
cd ~/tools/
echo "Done!"

#Install Waybackurls
echo "Installing Waybackurls..."
go get github.com/tomnomnom/waybackurls
echo "Done!"

#Install vhost Discovery
echo "Installing vhost Discovery..."
git clone https://github.com/jobertabma/virtual-host-discovery.git
cd ~/tools/
echo "Done!"

#Installing Altdns
echo "Installing AltDNS..."
git clone https://github.com/infosec-au/altdns.git
cd ~/tools/altdns
python setup.py build
python setup.py install
cd ~/tools/
echo "Done!"

#Installing Zile
echo "Installing Zile..."
git clone https://github.com/bonino97/new-zile.git
cd ~/tools/
echo "Done!"

#Installing Arjun
echo "Installing Arjun..."
git clone https://github.com/edduu/Arjun.git
cd ~/tools/
echo "Done!"

#Install GitHub Subdomains
echo "Installing GithubSubdomains..."
git clone https://github.com/gwen001/github-search.git
cd ~/tools/github-search
pip3 install -r requirements.txt
pip3 install -r requirements2.txt
pip3 install -r requirements3.txt
cd ~/tools/
echo "Done!"

#Install JSearch
echo "Installing JSearch..."
git clone https://github.com/incogbyte/jsearch.git
cd ~/tools/jsearch
pip3 install -r requirements.txt
cd ~/tools/
echo "Done!"

#Install Linkfinder
echo "Installing Linkfinder..."
git clone https://github.com/GerbenJavado/LinkFinder.git
cd ~/tools/LinkFinder
pip3 install -r requirements.txt
cd ~/tools/
echo "Done!"

#Install Subfinder
echo "Installing Subfinder..."
GO111MODULE=on go get -u -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder
cd ~/tools/
echo "Done!"

#Install Findomain
echo "Installing Findomain..."
git clone https://github.com/Edu4rdSHL/findomain.git
cd findomain
cargo build --release
sudo cp target/release/findomain /usr/bin/
cd ~/tools/
echo "Done!"

#Install Amass
echo "Installing Amass..."
export GO111MODULE=on
go get -v github.com/OWASP/Amass/v3/...

#Install API-LemonBooster
echo "Installing LemonBooster..."
git clone https://github.com/bonino97/LemonBooster-v2.git
cd ~/tools/LemonBooster-v2/API-LemonBooster-v2
sudo npm install
pm2 start Index.js
echo "Done!"

echo "All Done ~ Put the VPS Ip inside the platform. beta.lemonbooster.com"
hostname -I | awk '{print $1}'
hostname -I | awk '{print $1}'
hostname -I | awk '{print $1}'
hostname -I | awk '{print $1}'
hostname -I | awk '{print $1}'