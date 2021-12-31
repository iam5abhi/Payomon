# BusinessAPI

              # 1)Creating a BusinessUser Signup and Login routes are created
 
              # 2)creating a customer signup and Login are creatd 

               # BusinessUser
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
                      
# BusinessAPI SignUp fill are:
                name
                BusinessName,
                BusinessEmail,
                BusinessPhonenumber,
                password,
                conifrmpassword,
                pin
                
# BusinessAPI SignIn fill are:      
        BusinessEmail,
        password,
        
        
        
 # Add Bank Detail Merchant       
        1) Add A bank detail 
              i) route http://localhost:3400/api/signIn/addbankdetails
              ii) field are:-
                      AccountholderName,AccountNumber,BankName,IFSC_CODE
         2)Check the bank detail 
                route are :-http://localhost:3400/api/signIn/addbankdetails
         3) Update the Bank detail
                   route are:-http://localhost:3400/api/signIn/addbankdetails 
         4)Delete the bank Detail           
                    route are:-http://localhost:3400/api/signIn/addbankdetails 
# CUSTOMER API

              #1)Creating a CUSTOMER Signup and Login routes are created
 
              #2)creating a customer signup and Login are creatd 

              
                 4)cUSTOMER Signup
                        1)firtof all signup user to request to http://localhost:3400/api/customer/signUP using postman
                        2)fill the data 
                        3)send the from postman
                        4)hash the passWord
                  5) CUSTOMER Login     
                      1) first request to http://localhost:3400/api/customer/signIN
                      2) fill the email and password 
                      3) request to login 
                      3) if user is exits then user Sucessfully Login
                          i) if user sucessfully login then token will generate from 1hour
                      4) if user Is not exits then show error from your command prompt
                      
 # CUSTOMER SignUp fill are:
                name
                Email,
                Phonenumber,
                password,
                conifrmpassword,
                
                
 # CUSTOMER SignIn fill are:      
        Email,
        password,
        
        
        
        
# PAYMENTMODE ARE:-  
     CUSTOMER PAY MONEY FROM CLIENT 
         FIND THE DATA FROM CLIENT FROM PHONENUMBER
         FOM bUSINESSsCHEMA DATA TO BE FIND 
    
         
 
 # Authentication
    1) Create a middleware to authenticate the route without login the Customer cannot be Access the page
    2) firt create the SecretKey
    3) Access the Token
    4)last verify the tken from Jwt
    5)Every route protected
   
   
  # Customer Wallet
     1)After the customer signup the customer wallet Automatically created and by default add 100rs to Customer wallet Automatic
     2)After the Login the customer can seen the Wallet balance  route are:-http://localhost:3400/api/customer/wallet
     3)customer Add a blance to wallet   route are:-http://localhost:3400/api/customer/wallet/61cc589d4148f592e1cb06ee
     4)Customer send a money to merchant   routw are:-http://localhost:3400/api/customer/wallet/sendmonytowallet/61cc589d4148f592e1cb06ee
        
        
        
        
        
        
        
   

   # Dependencies use are:-
      bcrypt , express,mongoose ,express-validator,jsonwebtoken


