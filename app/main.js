//Node Constants
const ops = require('./init')
const port = 8888

//Express Routers
const users = require('./routers/userRouter')

init()

function init(){
    ops.server.listen(port, ()=> {
        console.log("Server is running on", `${port}`.yellow)
    })
    ops.app.use(ops.express.json());
    ops.app.use(ops.express.urlencoded({extended: false}))
    initRouters()

    function initRouters(){
        ops.app.use('/users', users);
    }
}


