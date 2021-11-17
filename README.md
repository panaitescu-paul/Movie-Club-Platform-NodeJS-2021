# Movie Club Platform - NodeJS, JavaScript - 2021
The Movie Club is a Web Application that is ***lightweight, fast, and easy to use***, in order to ***access relevant information about movies and have conversations with other people that care about movies***.

### Features:
There are 3 kinds of users for this platform, each of them with different access over the website:
1. Guest User
2. Member User
3. Admin User

#### 1. The Guest User will be able to:
- Read and search Movies and Crews
- Read Movie details (Overview, Ratings, Crew, Genres, Languages, Reviews, Trailer)
- Read Crew details (Overview, Movie List)
- Read the Community Chat
- Sign up as a Member
- Login as a Member or Admin

#### 2. The Member User will be able to:
- Do everything that a Guest User does (except Sign Up and Login)
- Create, read, update, delete Ratings and Reviews from Movies
- Create, read, update, delete Rooms and Messages from Community Chat
- Update and delete their User Profile
- Update their Password
- Log out from Member
            
#### 3. The Admin User will be able to:
- Create, read, update, delete, and search Movies, Crews, Admins, Members
- Read Movie details (Overview, Ratings, Crew, Genres, Languages, Reviews, Trailer)
- Read Crew details (Overview, Movie List)
- Attach to Movies: Crews, Roles, Genres, Languages
- Attach to Crews: Movies, Roles
- Log out from Admin


### The Project Objectives are to create a Web Paltform that has the next important implementations:
1. Database
2. Backend (with Restful APIs and Gateway)
3. Frontend
4. Microservices Architecture

### Technologies:
- Database (MySQL)
- Backend (NodeJS, Javascript)
- Frontend (HTML, CSS, JS, jQuery)
- Testing (Mocha, Chai)


### Preview:

![alt text](https://github.com/panaitescu-paul/BA-Project-2021/blob/main/screenshots/1.png)

![alt text](https://github.com/panaitescu-paul/BA-Project-2021/blob/main/screenshots/2.png)

![alt text](https://github.com/panaitescu-paul/BA-Project-2021/blob/main/screenshots/5.png)

![alt text](https://github.com/panaitescu-paul/BA-Project-2021/blob/main/screenshots/7.png)

![alt text](https://github.com/panaitescu-paul/BA-Project-2021/blob/main/screenshots/9.png)

![alt text](https://github.com/panaitescu-paul/BA-Project-2021/blob/main/screenshots/8.png)

![alt text](https://github.com/panaitescu-paul/BA-Project-2021/blob/main/screenshots/4.png)


## Installation Guide
### Prerequisites:
1. Install Node JS (https://nodejs.org/en/download/)
2. Install Express-Gateway (https://www.express-gateway.io/getting-started/) - Shortly, write
this command in terminal or command prompt after making sure that Node.js is installed:
npm install -g express-gateway
3. Install Redis on Windows:
https://riptutorial.com/redis/example/29962/installing-and-running-redis-server-on-windo
ws Unzip the rar file and find the redis-server.exe file to be able to start redis later on
4. Install Redis on MacOS:
https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-e b8df9a4f298) - Shortly, write this command in terminal after making sure that you have Homebrew installed: brew install redis

In order to install this application you should first make sure that you have everything stated in the Prerequisites in place, then clone the repository from the following GitHub link: https://github.com/panaitescu-paul/BA-Project-2021.
Afterwards, open the project in a code editor, open a terminal or command prompt and change directory to the project’s folder and then change the directory to the server folder. Then, in order to install all the dependencies you should type the command npm install. Then open a new terminal or command prompt and change the directory again to the server folder, then go into the gateway folder, then change the directory into the mcdb_gateway folder and type the command npm install to install de gateway’s dependencies. Now, open the redis server, either by writing in a new terminal the command redis-server if you are a MacOS user, or by opening the redis-server.exe file if you are a Windows user. After that, open a terminal or command prompt and change the directory to the mcdb_gateway folder and write the command npm start. Finally, open another terminal or command prompt and change the directory into the server folder of the application and type the command node app. Now, you can either click on the link provided on the terminal (http://localhost:4000/) or you can copy and paste the link into a browser url to open the Movie Club web application.

### Creators
- © Paul Panaitescu (https://github.com/panaitescu-paul)
- © Constantin Razvan Tarau (https://github.com/Cons19)
