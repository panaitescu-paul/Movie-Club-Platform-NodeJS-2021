# Movie Club Platform

Movie Club is a Web Application that is lightweight, fast, and easy to use, in order to access relevant information about movies and have conversations with other people that care about movies.  
  
Prerequisites:  
Install Node JS (https://nodejs.org/en/download/)  
Install Express-Gateway (https://www.express-gateway.io/getting-started/) - Shortly, write this command in terminal or command prompt after making sure that Node.js is installed: npm install -g express-gateway   
Install Redis on Windows: https://riptutorial.com/redis/example/29962/installing-and-running-redis-server-on-windows Unzip the rar file and find the redis-server.exe file to be able to start redis later on  
Install Redis on MacOS: https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298) - Shortly, write this command in terminal after making sure that you have Homebrew installed: brew install redis  
  
In order to install this application you should first make sure that you have everything stated in the Prerequisites in place, then clone this repository.  
Afterwards, open the project in a code editor, open a terminal or command prompt and change directory to the project’s folder and then change the directory to the server folder. Then, in order to install all the dependencies you should type the command npm install. Then open a new terminal or command prompt and change the directory again to the server folder, then go into the gateway folder, then change the directory into the mcdb_gateway folder and type the command npm install to install de gateway’s dependencies. Now, open the redis server, either by writing in a new terminal the command redis-server if you are a MacOS user, or by opening the redis-server.exe file if you are a Windows user. After that, open a terminal or command prompt and change the directory to the mcdb_gateway folder and write the command npm start. Finally, open another terminal or command prompt and change the directory into the server folder of the application and type the command node app. Now, you can either click on the link provided on the terminal (http://localhost:4000/) or you can copy and paste the link into a browser url to open the Movie Club web application.
