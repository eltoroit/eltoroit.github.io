---
layout: default
title: Initializing The Raspberry Pi
---

Before we start working on the projects, we need to initialize the Raspberry Pi by setting up NodeJS.

# Prepare The Hardware

Before you begin, let's get some stuff ready. You need:

- Raspberry Pi computer
- MicroSD memory card (minimum 16GB)
- A computer to download the O/S and write to the Micro SD memory card. We call this the "main computer."
  HDMI monitor, USB keyboard and mouse. These devices are only used for the setup because we don't need them after we configure SSH.

# Initialize The SD Card

1. Go to [https://www.raspberrypi.org/software](https://www.raspberrypi.org/software) https://www.raspberrypi.org/software and download the **Raspberry Pi Imager** for your operating system.
2. Following the screens, choose the Raspberry Pi OS. For this, we select the default **"Raspberry Pi OS (32-bit)."**
3. Click CRTL + SHIFT + X to open the advanced options
   - Enable SSH and set the password authentication
   - Configure the WIFI network
   - Click `Save`
4. Select the storage based on the SD card you have available.
5. Finally, click `Write`

# Initialize The Raspberry Pi

1. Insert the Micro SD card in the Raspberry Pi
2. Connect the monitor, mouse and keyboard
3. Turn it on, and follow the screens menus to set up the location, password, screen, WIFI, and perform software updates.

   If you do have several routers at your location, make sure you select the one that is as close as possible to the ISP modem so you can access your Raspberry Pi from outside your network without having to make too many changes ;-)

# Enable SSH and VNC

1. Go to Menu > Preferences > Raspberry Pi Configuration > Interfaces
2. Enable `SSH` and `VNC`
3. Click `OK` and `OK`
4. On the terminal window, type `hostname -I` to find the Raspberry Pi's IP address in your local network

   You can use an SSH client (command line terminal) and a VNC client (GUI desktop) to connect your main computer to the Raspberry Pi using that IP address. After completing the VNC setup, you may disconnect the monitor, keyboard and mouse.

# Configure NodeJS

It's always a good idea to update your Raspberry Pi before installing any software, so open the terminal window and execute these commands:

1. Type `sudo apt-get update.`
2. Type `sudo apt-get dist-upgrade.`
3. Type `sudo apt full-upgrade.`

Following the steps here [https://github.com/nodesource/distributions#deb](https://github.com/nodesource/distributions#deb), we are going to install the LTS version of NodeJS.

1. You need to log in as root, so type this `sudo su`.
2. Download NodeJS `curl -fsSL https://deb.nodesource.com/setup_current.x | bash -`
3. Install it `apt-get install -y nodejs`.

Let's create a folder for the work in the terminal window.

1. Ensure you are in the home directory `cd ~/`
2. Make the folder `mkdir work`
3. Navigate to it `cd work`

Let's ensure we have NodeJS running correctly.

1. Create a new folder `mkdir tests`
2. Change to it `cd tests`
3. Write a simple NodeJS code `echo "console.log('Hello NodeJS');" > test01.js`
4. Run it `node test01.js`

You should see `Hello NodeJS` on the screen.

# Configure a NodeJS Web Server

What about a web server? Great question! I am glad you asked. Let's copy this code in a file named `test02.js`

```js
const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello NodeJS</h1>");
  res.end(`${new Date()}`);
});
server.listen(3000, "127.0.0.1");
console.log("Web server is running…");
```

After saving the file, run it by typing this command: `node test02.js`. You should see `Web server is running…` in the terminal, but more importantly, if you open the web browser in the Raspberry Pi and go to this address `http://127.0.0.1:3000`, you should see the `Hello NodeJS` page with your current time.

![NodeJS WebServer @ Localhost](/assets/blog/2021-03-14/NodeJS_WebServer_Localhost.png)

At this point, we can browse the NodeJs web server from a browser on the same device (Raspberry Pi), but not from your main computer even though they are in the same network. Let's fix that by installing NGINX

It's always a good idea to update your Raspberry Pi before installing any software, so in the terminal window, type `sudo apt-get update` followed by `sudo apt-get dist-upgrade`

Now, let's install NGINX using this command: `sudo apt-get install nginx` and follow the prompts.

At this point, we can open a browser on our main computer and browse to the IP address we found earlier (`hostname -I`). You should see a page with this message: Welcome to Nginx!

![Basic NGINX](/assets/blog/2021-03-14/NGINX_Basic.png)

But this is not our NodeJS server, so let's configure NGINX.

1. Change to the directory where NGINX stores the configuration settings `cd /etc/nginx/sites-available/`
2. Make a backup of the current settings `sudo cp default default.bak`
3. Open a text editor with the config file `sudo geany default`

Replace the entire contents (that's why we did a backup) with this code:

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

Restart NGINX by using this command `sudo service nginx restart`. You should now be able to open a web browser on your main computer and browse to the IP address for the Raspberry Pi. If you configure your Modem (port redirect), you could expose your Raspberry Pi as a web server to the world.

# Configure VS Code Remote Development

On your main computer, open VS Code and add these two extensions:

- Remote - SSH
- Remote - SSH: Editing Configuration Files

Open the command palette and type `>Remote-SSH: Connect Current Window to Host…` enter the IP address for your Raspberry Pi and the password if asked.

You can now use the Raspberry Pi from VS Code as if this was your main computer. For example, if you open files or save them, they are written to the Raspberry Pi. If you open the terminal window, it's your Raspberry Pi…!
