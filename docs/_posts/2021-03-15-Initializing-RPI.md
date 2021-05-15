---
layout: default
title: Initializing The Raspberry Pi
---

Before we start working on the projects, we are going to need to initialize the Raspberry PI by setting up NodeJS and few other tools... so let's begin.

# Prepare The Hardware

Before you begin, let’s get some stuff ready. You will need:

- Raspberry Pi computer
- MicroSD memory card (minimum 16GB)
- HDMI monitor
- USB keyboard and mouse (Just for the setup, we will use SSH later on)
- The "main computer", which will help you download the Raspberry PI O/S and write to the Micro SD memory card

# Initializing The Micro SD Card

1.  Go to https://www.raspberrypi.org/software and download the Raspberry Pi Imager for your operating system
2.  Following the screens, choose the Raspberry PI OS. I have chosen the default entry “Raspberry Pi OS (32-bit)” and that is good for waht we need.
3.  Click CRTL + SHIFT + X to open the advanced options
    1. Enable SSH and set the password authentication
    2. Configure the WIFI network
    3. Click [`Save`]
4.  Select the storage based on the SD card you have available.
5.  Finally click [`Write`]

# Initialize The Raspberry PI

1. Insert the Micro SD card in the Raspberry PI
2. Connect the monitor, mouse and keyboard
3. Turn it on, and follow the screens menus to setup the location, password, screen, WIFI, and perform software updates
   - If you do have several routers at your location, make sure this is as close as possible to the ISP modem so you can access your Raspberry PI from outside your network without having to configure too many hubs ;-)
4. Enable SSH and VNC
   1. Menu > Preferences > Raspberry PI Configuration > Interfaces
   2. Enable [`SSH`] and [`VNC`]
   3. Click [`OK`] and [`OK`] again
   4. On the terminal window, type [`hostname -I`] to find the Raspberry PI’s IP address in your local network
5. On your main computer, you can use a SSH client and a VNC client to connect to your Raspberry PI using that IP address, when the VNC is completed you may disconnect the keyboard and mouse and just use your main computer.

# Configure A NodeJS Web Server

1. It’s always a good idea to ensure your Raspberry PI is updated before installing any software, so in the terminal window type [`sudo apt-get update`], [`sudo apt-get dist-upgrade`]
2. Following the steps here (https://github.com/nodesource/distributions#deb) we are going to install the LTS version of NodeJS. First you need to log in as root, so type this [`sudo su`], then type these commands [`curl -fsSL https://deb.nodesource.com/setup_current.x | bash -`] and then [`apt-get install -y nodejs`]
3. Let’s create a folder for the work, in the terminal window ensure you are in the home directory [`cd ~/`] and then [`mkdir work`] and [`cd work`]
4. Let’s ensure we have NodeJS running properly. Create a new folder [`mkdir tests`], then [`cd tests`] then [`echo "console.log('Hello NodeJS');" > test01.js`] and finally [`node test01.js`]. You should see [`Hello NodeJS`] on the screen.
5. What about a web server? Copy this code in a file named [`test02.js`]

```
const http = require("http");
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write('<h1>Hello NodeJS</h1>');
    res.end(`${new Date()}`);
});
server.listen(8080, "127.0.0.1");
console.log("Web server is running...");
```

Once the file has been saved, run it like this [`node test02.js`], you should see [`Web server is running...`] in the terminal, but more importantly, if you open the web browser in the Raspberry PI and go to this address [http://127.0.0.1:3000](http://127.0.0.1:3000) you should see the message [`Hello NodeJS`] on the screen.

At this point, we can browse the NodeJs web server from a browser in the Raspberry PI, but not from our main computer even though they are in the same network. Let’s fix that by installing NGINX

6. It’s always a good idea to ensure your Raspberry PI is updated before installing any software, so in the terminal window type [`sudo apt-get update`], [`sudo apt-get dist-upgrade`]
7. Now, let’s install NGINX by using this command [`sudo apt-get install nginx`] and follow the prompts.
8. At this point, we can open a browser on our main computer and browse to the IP address we found earlier ([`hostname -I`]). You should see a page with this message: **Welcome to nginx!**
9. But this is not our NodeJS server, so let’s configure NGINX. First, make a backup of the current settings [`cd /etc/nginx/sites-available/`], then [`sudo cp default default.bak`] and now opening the config file [`sudo geany default`] and replacing the entire contents (that’s why we did a backup) with this code:

```
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

10. Restart NGINX by using this command [`sudo service nginx restart`], you should now be able open a web browser on the main computer and browse to the IP address for the Raspberry PI. If you configure your Modem (port redirect) you could expose your Raspberry PI as a web server to the world.

# Configure VS Code Remote Development

1. On your main computer, open VS Code and add these two extensions [Remote - SSH and Remote](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) and [SSH: Editing Configuration Files](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh-edit)
2. Open the command palette and type [`>Remote-SSH: Connect Current Window to Host...`] enter the IP address for your Raspberry PI and the password if asked.
3. You can now use the Raspberry PI from VS Code as if this was your main computer. For example, if you open files or save them, they will be written to the Raspberry PI. Actually if you open the terminal window, it’s your Raspberry PI... !
