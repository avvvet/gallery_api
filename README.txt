# init the project
npm install  

#create mysql database 
gallery or other name

#.env
make sure to enter the database name (that you have created) and your local mysql user name and password in the .env file.

#migration
node_modules/.bin/sequelize db:migrate 
this will create Post model

#public picture folder 
./upload/photo

#start the server
npm start