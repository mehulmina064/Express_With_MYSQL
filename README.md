# Express GameData 

## Development Environment Setup

1. Install Node.js and npm: [Node.js Download](https://nodejs.org/)
2. Install MySQL: [MySQL Download](https://dev.mysql.com/downloads/)
3. Install MongoDB: [MongoDB Download](https://www.mongodb.com/try/download/community)
4. Install RabbitMQ: [RabbitMQ Download](https://www.rabbitmq.com/download.html)

## Project Setup

2. Install dependencies: `npm install`
3. Start the server: `npm start`



## For sql Set up

In case of MAC, the
Step:1-
install mysql from official website

Step 2-
Set path of mysql in the bash profile

nano ~/.bashrc
Add the following line at the end of the file:

alias mysql=/usr/local/mysql/bin/mysql

than save and exit restart the terminal

step 3 -
source ~/.bashrc
 for updating the bash by new written lines 

step 4-
 use mysql server via-
 mysql -u root -p


## For RabbitMQ
Step 1:
brew install rabbitmq
and 
npm install amqplib


Step 2:
to check installation of RabbitMQ

 brew info rabbitmq 

Strep 3:
to run the rabbitmq server

  brew services start rabbitmq

Or, if you don't want/need a background service you can just run:

  CONF_ENV_FILE="/opt/homebrew/etc/rabbitmq/rabbitmq-env.conf" /opt/homebrew/opt/rabbitmq/sbin/rabbitmq-server


Step 4:
replace env file with running connection URL and other configuration


Step 5:
Start RabbitMQ Server:

## Ensure RabbitMQ server is running on your machine.

  node eventSubscriber.js

## This script will listen for events and log them to the event.log file.
Run the Application:

Ensure your Node.js application is running (use node server.js or any method you prefer).
Register a new user through the registration endpoint.
Check the logs in the terminal where the eventSubscriber.js is running. You should see the log for the user registration event.
