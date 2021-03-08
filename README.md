![Memestash (NodeJS Backend)](./markdown/memestash_node.png)

---

## Introduction
Welcome to the MemeStash NodeJS Back-End. This application can be used in combination with one of the 2 MemeStash clients
in order to provide them with data.

## Setup
This repo comes included with a `docker-compose.yaml` file. With this, you can easily set up a working database for this repo:

### Prerequisites
- Make sure that you're able to run docker containers. [Docker Desktop](https://www.docker.com/products/docker-desktop) is an easy-to-use client to run containers on your host machine.
- Make sure that the following ports aren't used by any programs on your host machine *(**Tip**: If you're not sure, you can run the following command in a Windows CLI in order to check: `netstat -ano | findstr <portnumber>`)*
    - 3306 *(This is the port used by MariaDB)*
    - 8080 *(This is a port reserved for Admirer, a web interface for MariaDB)*
    
### Setup
1. Clone this project using `git clone`
2. Open a terminal in the cloned directory
3. Run the following command: `docker-compose up -d`. This will run the containers in **detached mode**, so that you're able to keep using your CLI.
4. Connect to the database using Admirer or your GUI tool of choice:
    - **Host**: localhost
    - **Port**: 3306
    - **Username**: root
    - **Password**: Friday13th!
5.  Run the `db-structure.sql` and `db-filler.sql` **(W.I.P.)**.

That's it! The database should be configured and all the needed users and their permissions should be made. You can run the server by typing `node run-server` in a CLI *(**Note:** Make sure you're in the cloned directory)*