# Devitinder  api

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionrequestRouter
- POST /signup/request/send/interested/:userId
- POST /login/request/send/ignored/:userId
- POST /logout/request/review/accepted/:requestId
- POST /logout/request/review/rejected/:requestId

userRouter
- GET /USER/CONNECTIONS
- GET /USER/request
- GET /feed
