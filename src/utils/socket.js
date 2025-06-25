const socket =require('socket.io')
export const initializeSocket=(server)=>{
    const io= socket(server,
      {
         cors:{ origin:'http://localhost:5173'},
    },)
    io.on('connection',(socket)=>{
        // handling the events
        socket.on('connection',()=>{

        })

          socket.on('sendMessage',()=>{
            
        })
          socket.on('disconnect',()=>{
            
        })

    })

}
