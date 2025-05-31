# Devitinder  api

# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# connectionrequestRouter
- POST /request/send/:status/:userId
- POST /request/send/ignored/:userId
- POST /request/send/interested/:userId

- POST /request/review/:status/:requestId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# userRouter
- GET /user/connections
- GET /user/request
- GET /feed
