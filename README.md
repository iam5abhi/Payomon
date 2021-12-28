# BusinessAPI

 #1)Creating a BusinessUser Signup and Login routes are created
 #2)creating a customer signup and Login are creatd 
 
  #BusinessUser
    1) Either fork or downlaod the app and open the folder  in the Api
    2)Install all the Dependencies using "npm insall" in command prompt
    3)Start the web server using  node app || nodemon app local command. the app will be served http://localhost:3400/api/
    4)BusinessUser Signup
           1)firtof all signup user to request to http://localhost:3400/api/signup using postman
           2)fill the data 
           3)send the from postman
           4)hash the passWord
     5) BusinessUser Login     
         1) first request to http://localhost:3400/api/signIn
         2) fill the email and password 
         3) request to login 
         3) if user is exits then user Sucessfully Login
             i) if user sucessfully login then token will generate from 1hour
         4) if user Is not exits then show error from your command prompt
