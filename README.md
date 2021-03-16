![Memestash (NodeJS Backend)](./markdown/memestash_node.png)

---

Welcome to the MemeStash NodeJS Back-End. This application can be used in combination with one of the 2 MemeStash clients
in order to provide them with data.

## Setup
This repo comes included with a `docker-compose.yaml` file. With this, you can easily set up a working database for this repo:

### Prerequisites
- Make sure that you're able to run docker containers. [Docker Desktop](https://www.docker.com/products/docker-desktop) is an easy-to-use client to run containers on your host machine.
- Make sure that the following ports aren't used by any programs on your host machine *(**Tip**: If you're not sure, you can run the following command in a Windows CLI in order to check: `netstat -ano | findstr <portnumber>`)*
    - 3306 *(This is the port used by MariaDB)*
    - 8080 *(This is a port reserved for Admirer, a web interface for MariaDB)*
    
### Installation process
1. Clone this project using `git clone`
2. Open a terminal in the cloned directory
3. Run the following command: `docker-compose up -d`. This will run the containers in **detached mode**, so that you're able to keep using your CLI.
4. Connect to the database using Admirer or your GUI tool of choice:
    - **Host**: localhost
    - **Port**: 3306
    - **Username**: root
    - **Password**: Friday13th!
5.  Run the `db-structure.sql` and `db-filler.sql` **(W.I.P.)**.

That's it! The database should be configured and all the needed users and their permissions should be made. You can run the server by typing `npm run server` in a CLI *(**Note:** Make sure you're in the cloned directory)*

## Features
### Encryption
All password are encrypted using BCrypt encryption package. if you wish to manually encrypt a password, you can do this by using the following command:
```powershell
    npm run encrypt <string>
```
### Console
The console will display the following things during it's lifetime:
- Configuration information *(Like port configuration, etc...)*
- Sucessfull requests
- Unsuccessfull requests
### API Spec
#### URL & Parameters & Body Validation
URL, Parameter & Body validation is done with [Express OpenAPI Validator](https://www.npmjs.com/package/express-openapi-validator), which uses the OpenAPI spec sheet to check requests.
#### Users
|HTTP Verb|Endpoint|Description|Stage?|
|---|---|---|---|
|GET|`/users`|Retrieves a list of all users and info about them. Can be filtered with query parameters.| Implemented |
|GET|`/users/{ouid}`|This endpoint gets all the information of a user to be able to construct the homepage. This includes things like cards, name, wallet, etc...|Mock|
|PUT|`/users`|This endpoint will add a new user account to the application.|Implemented <br> **Note:** Error feedback is wonky on this one. This is already planned to be reworked.|
|PATCH|`/users/{ouid}`|This endpoint is used in order to change account information of the user (Such as the account’s email).|Mock|
|POST|`/users/login`|This endpoint is responsible for authenticating a user.|N/A|
#### Cards
|HTTP Verb|Endpoint|Description|Stage?|
|---|---|---|---|
|GET|`/cards`|Gets all the cards registered in the system. Can be filtered using query parameters.|N/A|
|GET|`/users/{ouid}/cards`|Gets the collection of cards of a user, identified by his id.|N/A|
|PUT|`/users/{ouid}/cards/{cid}`|This endpoint is responsible for adding a card to the user’s collection. The price needs to be supplied in order to subtract it from the user’s wallet.|N/A|
#### Chats
|HTTP Verb|Endpoint|Description|Stage?|
|---|---|---|---|
|GET|`/users/{ouid}/chats`|This endpoint is used to retrieve the messages of a user.|N/A|
|GET|`/users/{ouid}/chats/{tuid}`|This endpoint will retrieve the chat between the user with the `ouid` and the user with the `tuid`.|N/A|
|PATCH|`/users/{ouid}/chats/{tuid}`|This endpoint will add another message to the message queue between the user with the associated `ouid` and the user with the associated `tuid`.|N/A|
|PUT|`/users/{ouid}/cards/{cid}`|This endpoint will start a message queue between 2 users. A initial message needs to be supplied with the request before a message queue is made.|N/A|
#### Trades
|HTTP Verb|Endpoint|Description|Stage?|
|---|---|---|---|
|GET|`/users/{ouid}/trades`|This endpoint is used to get incoming & outgoing trade requests.|N/A|
|PUT|`/users/{ouid}/trades/{tuid}`|Adds a trade with a initial offer and/or requested items for that offer.|N/A|
|PATCH|`/users/{ouid}/trades/{tid}`|This endpoint is used to accept or deny a trade request.|N/A|
#### Wallet
|HTTP Verb|Endpoint|Description|Stage?|
|---|---|---|---|
|PUT|`/users/{ouid}/wallet`|Adds a new amount of coins to the wallet.|N/A|

## FAQ
**Q:** The node scripts don't run! <br>
**A:** You might have to run `npm run` in order to discover the scripts. If that doesn't solve the problem, double check if you're in the root directory. <br>
Alternatively, you can invoke the file if needed:
- `npm run server` => `node ./app/main.js`
- `npm run encrypt <string>` => `node ./app/encrypt.js -i <string>`
