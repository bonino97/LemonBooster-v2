# LemonBooster-v2

### Register on → http://beta.lemonbooster.com/auth/register

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
    - The script gonna install the database for save results, all the tools used by the tool and all the requireds dependencies.
    - The installer leave your VPS ready to configure on the WEB.

9. Once the Installer finish. Go to [Settings](http://beta.lemonbooster.com/settings). and load the VPS Ip .

10. If everything installed correctly, you should see [Status: ✔ ]. In the left Sidebar options.

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
- Save results on MongoDB.
- Compare Old Results with New Results in each Scanning.
- New Results in Monitoring Option. 
