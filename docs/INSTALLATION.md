# Installation

Installation instructions vary depending on your OS. I'm on Windows 10, so I'm going to provide directions for instructions on Windows only.

## Requirements

* MongoDB 3.4 Database
* Redis database as session store
* [NodeJS](https://nodejs.org/) ^8.4.0, npm ^5.3

## Install packages

Start by cloning the repository, then `npm install`. This will take a while.

Please note that you might run into problems during installation under windows where `fsvents` installation fails with EPERM. In this case, try `npm install --verbose` or `npm install --force` and make sure the console that you run this command in has administrator privileges.

This is a known issue with npm where for some files a race condition fails because required files are already deleted. Lets hope for npm6 I guess? `--verbose` creates more noise and delays the operation a bit, which helps with the race condition - `--force` does, too. Weird.

The `postinstall` script creates necessary directories.

## Prepare certificates for https

For production, you will probably want to setup letsencrypt. For development - or if on a windows machine - I recommend making it simple and creating long-lasting dev certificates. These will be untrusted by your browser, but they will work.

```
openssl genrsa -out localhost.key 2048
openssl req -new -x509 -key localhost.key -out localhost.cert -days 3650 -subj /CN=localhost
```

Copy the two generated files to `server/config/https/`.
 

## Setup Mailserver for Development

I strongly recommend [https://mailtrap.io/](https://mailtrap.io/) - they pretend to be a mailserver, but do not actually send anything. Instead, the mails are placed conveniently in an inbox for you to study. Create a free inbox, and copy the credentials to `/server/config/.env`. 

## Setting up MongoDB

For development I use [mLab.com](https://mlab.com/) - they have a free sandbox plan that offers 500MB, which should be fine for development. Create your sandbox plan, create a database and a user and copy the credentials into `/server/config/.env`.

Test that you can connect to your new MongoDB Database (by using a MongoDB client such as [Robo 3T](https://robomongo.org/download)).

If this works, seed the database with test files:

```
npm run db.seed
```

## Setting up Redis

To setup Redis on Windows, you have several options:

**1. WSL (Windows Subsystem for Linux)**

To install WSL, first activate Windows Developer Mode: [https://www.wikihow.com/Enable-Developer-Mode-in-Windows-10](https://www.wikihow.com/Enable-Developer-Mode-in-Windows-10).

Then install WSL: [https://msdn.microsoft.com/en-us/commandline/wsl/install-win10](https://msdn.microsoft.com/en-us/commandline/wsl/install-win10).

After the obligatory reboots, check that WSL is working by opening a shell and typing `bash`. If everything is fine, you should be greeted by a prompt `[UnixUsername]@[Computername]:`

Rejoice, you now have a Linux subsystem. In your bash, install redis:

```
sudo apt-get update
sudo apt-get install redis
redis-server --daemonize yes
```

The redis server will run as long as you have the shell open.

**2. Vagrant**

[https://github.com/ServiceStack/redis-windows/#option-2-running-the-latest-version-of-redis-with-vagrant](https://github.com/ServiceStack/redis-windows/#option-2-running-the-latest-version-of-redis-with-vagrant) 

I have no clue about Vagrant `¯\_(ツ)_/¯`

**3. Microsoft's Redis Port**

[https://github.com/ServiceStack/redis-windows/#option-3-running-microsofts-native-port-of-redis](https://github.com/ServiceStack/redis-windows/#option-3-running-microsofts-native-port-of-redis)

The native Windows Redis port from Microsoft simply installs `.exe`s for `redis-server` and `redis-cli`. There are also options to install the redis server as a service.

## Prepare Client

To prepare the client, we need to generate the files:

```
npm run app.static.build
npm run js.prod
```

## Finally ...

Start the servers:

```
npm run server.start
```
Your should get messages like these:

```
[App] Successfully connected to Redis.
[App] Successfully connected to MongoDB.
```

To start the turn 'clock', start a new console/screen and:

```
npm run cron.start
```

Now, open your browser and point it to [http://localhost:7777](http://localhost:7777). Email of admin user is `ashaltiriak@gmail.com`, password for all users is `123123`.
