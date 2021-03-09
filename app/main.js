//Node Constants
const ops = require('./init')
const port = 8888

//Express Routers
const users = require('./routers/userRouter')

ops.server.listen(port, ()=> {
    console.log(`Server is running on ${port}`)
})

ops.app.use('/users', users);

