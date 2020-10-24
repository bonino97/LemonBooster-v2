# LemonBooster-v2

## ¿How to Run?

1. Go to [DigitalOcean](https://m.do.co/c/b11f008f8927), [Linode](https://www.linode.com/?r=30f11dc4791aafe40fad71f0de8f0682f88fc7af) or run a VPS with your favourite provider.
    - A VPS of 2gb ram and 50gb storage is recommended.

2. On your Shell → **ssh root@[YourVpsIP]**

3. Once inside VPS → **mkdir ~/tools**

4. Go to the tools folder → **cd ~/tools**

5. Clone the repo → **git clone https://github.com/bonino97/LemonBooster-v2.git**

6. Go to Config LemonBooster folder → **cd ~/tools/LemonBooster-v2/Config-LemonBooster-v2**

7. Give privileges to the SH Installer. → **chmod +x Install-LemonBooster-Ubuntu20.04.sh**
    - If you have a VPS with Ubuntu 18.04. → **chmod +x Install-LemonBooster-Ubuntu18.04.sh**

8. Run the Installer → **./Install-LemonBooster-Ubuntu20.04.sh**
    - The script gonna install the database for save results, all the tools used by the tool and all the requireds dependencies.
    - The installer leave your VPS ready to configure on the WEB.

9. Once the Installer finish. Go to [Settings](http://beta.lemonbooster.com/settings). and load the VPS Ip .

10. If everything installed correctly, you should see [Status: ✔ ]. In the left Sidebar options.
