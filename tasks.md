#  find Users
- difference between user.findOne() and user.find()
- build an  API - Get user by email
- API - Get -feed - get all the users by email
- API- Get user by Id 
- CREATE A DELETE USER API
- API level validations on patch request and Signup post 
- Add API validation for each field


NEVER EVER TRUST req.body

#  SIGNUP VALIDATION
SIGNUP VALIDATION
- validate data in signup 
- install bcrypt package
- create a password hash
- save user with encrypted password

- install cookie-parser
- send a dumy cookie to user
- create a profile api and check if yo recieved a cookie back
- In login api ,after email and pass validation , create a jwt token send back to user in cookie
- read cookie inside user api and find user logged in

- write userAuth middleware and add to profileapi and new api senconnection
- set the expiry of jwt token and cookes to 7 days 


# routers
- explore express.router
- manage auth profile request router
- import this router in app.js


# CONNECTION REQUEST 
- create connectionRequestSchema add fields and validation
- connection request api and think about all the corner cases, proper validation of data,handle corner cases
- $or:[] querry $and:[] search on mongodb
- schema.pre function use cases
- write code with proper validations /request/review/:status/:requestId


# SOCKET SETUP
- first install socket.io
- then using existing express app create http server, after that initialize socket.io in another file 

# show green symbol when online