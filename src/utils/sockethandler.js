// socket/socketHandler.js

const ADMIN_ROOM = 'admin_room'

const socketHandler = (io) => {

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id)

        // ✅ Har user admin room mein join karo!
        socket.join(ADMIN_ROOM)
        console.log(`Socket ${socket.id} joined ${ADMIN_ROOM}`)

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id)
        })
    })

}

module.exports = { socketHandler, ADMIN_ROOM }