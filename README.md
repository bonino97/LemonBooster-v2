# LemonBooster-v2

#### Register on → http://beta.lemonbooster.com/auth/register
#### Follow the Installation steps on → http://beta.lemonbooster.com/docs

#### This tool runs and stores results locally, so no one (not even me) will have access to your data from outside.

## ¿What is LemonBooster?

It is a tool that automates and monitors a large part of the Recon phase.

It runs in a web environment, and facilitates the execution of tools.

## ¿How to Run?

1. Go to [DigitalOcean](https://m.do.co/c/b11f008f8927), [Linode](https://www.linode.com/?r=30f11dc4791aafe40fad71f0de8f0682f88fc7af) or run a VPS with your favourite provider.
    - A VPS of 2gb ram and 50gb storage is recommended.

2. On your Shell →  ```ssh root@[YourVpsIP]```

3. Once inside VPS → ```mkdir ~/tools```

4. Go to the tools folder → ```cd ~/tools```

5. Clone the repo → ```git clone https://github.com/bonino97/LemonBooster-v2.git```

6. Go to Config LemonBooster folder → ```cd ~/tools/LemonBooster-v2/Config-LemonBooster-v2```

7. Give privileges to the SH Installer. → ```chmod +x Install-LemonBooster-Ubuntu20.04.sh```
    - If you have a VPS with Ubuntu 18.04. → ```chmod +x Install-LemonBooster-Ubuntu18.04.sh```

8. Run the Installer → ```./Install-LemonBooster-Ubuntu20.04.sh```
    - The script gonna install the database for save results, all the tools used by LemonBooster and all the requireds dependencies.
    - The installer leave your VPS ready to configure on the WEB.

9. Once the Installer finish. Go to [Settings](http://beta.lemonbooster.com/settings). and load the VPS Ip .

10. If everything installed correctly, you should see [Status: ✔ ]. In the left Sidebar options.

11. **IMPORTANT!** → If you want to see the proccess running:
    - Go to Config Folder → ```cd ~/tools/LemonBooster-v2/Config-LemonBooster-v2```
    - Give privileges to the ViewExecution SH. → ```chmod +x ViewExecution.sh```
    - Run SH. → ```./ViewExecution.sh```
    - By this way, you can execute the tools, and see all the proccess running (tools included).
    
![LemonBooster-GIF](https://i.pinimg.com/originals/78/9d/62/789d620a379636d58b64755a84223599.gif)

## Features: 

- OneClick complete Scanning. [Run Subdomain Enumeration, Alives, Screenshots, Spidering]  
- Subdomain Enumerations. [Findomain, Subfinder, Assetfinder, Amass, Github Search, Permutations]
- Alives. [Httprobe]
- Subdomain Response Codes. [Hakcheckurl]
- Screenshots. [Aquatone]
- Js Scanning. [Linkfinder]
- Waybackurls. [Waybackurls]
- Spidering. [GoSpider, Hakrawler].
- Dir Bruteforcing. [Dirsearch].
- Get multiples loaded lists to use.
- Save results on MongoDB.
- Compare Old Results with New Results in each Scanning.
- New Results in Monitoring Option. 

### Tools: 
- https://github.com/Findomain/Findomain
- https://github.com/tomnomnom/assetfinder
- https://github.com/projectdiscovery/subfinder
- https://github.com/OWASP/Amass
- https://github.com/gwen001/github-search
- https://github.com/OJ/gobuster
- https://github.com/tomnomnom/httprobe
- https://github.com/michenriksen/aquatone
- https://github.com/GerbenJavado/LinkFinder
- https://github.com/hakluke/hakcheckurl
- https://github.com/tomnomnom/waybackurls
- https://github.com/jaeles-project/gospider
- https://github.com/hakluke/hakrawler
- https://github.com/maurosoria/dirsearch

Many thanks to the tools developers <3

### Programs List
![Programs](https://i.pinimg.com/originals/2f/47/57/2f4757ceaba47697c1d36a5f07ee18a5.jpg)

### Enumeration Options
![EnumOptions](https://i.pinimg.com/originals/27/c9/65/27c965db9e7846ba9b6a552ca25c3d93.jpg)

### Executed Results
![Results](https://i.pinimg.com/originals/6a/99/4b/6a994be464d015449fd1c179d1948109.jpg)

### Discovery Options
![DiscOptions](https://i.pinimg.com/originals/6b/8a/5f/6b8a5f3d4a49f16cabb0a8aafb14fc74.jpg)

### Discovery BruteForcing Option
![DiscBruteForcingLists](https://i.pinimg.com/originals/41/34/e9/4134e93c19a353226b224ff409ef75e3.jpg)

### Monitoring Results
![Monitoring](https://i.pinimg.com/originals/ae/eb/91/aeeb91efda9925e58b558c73820995c0.jpg)


## ¿How to add your own Wordlist?
Copy and Paste the List inside the Lists folder →  ```cp Example.txt ~/tools/LemonBooster-v2/API-LemonBooster-v2/Common/Lists```

### ToDo List.

- [ ] Telegram Bot
- [ ] Port Scanning with Naabu
- [ ] Ffuf
- [ ] Gau
- [ ] JSF Scan
- [ ] Kxss
- [ ] Paramspider / Arjun

#### If you found a bug, please send to support@lemonbooster.com or make a Github Issue. :)
#### Any suggestion is welcome.
#### Follow us on [Twitter](https://twitter.com/lemon_booster)

If you are interested in support the tool because you liked the project:

<a href="https://www.buymeacoffee.com/lemonbooster"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=lemonbooster&button_colour=00f2c3&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"></a>

**BTC Wallet**: ```156CNj43EDXKWj2s2sKnNzWga3jX4kHQYf```

**ETH Wallet**: ```0x2318eB71Ff070955aC7064750503855392aE83A9```

# ~ HappyHacking ~
