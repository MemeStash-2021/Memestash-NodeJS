//Node Constants
const ws = require('./config/ws.js')
const colors = require('colors')

//Express Routers
const users = require('./routers/userRouter')

init()

function init(){
    ws.server.listen(ws.port, ()=> {
        console.log("Server is running on", `${ws.port}`.yellow)
    })
    ws.app.use(ws.express.json());
    ws.app.use(ws.express.urlencoded({extended: false}))
    initRouters()

    function initRouters(){
        ws.app.use('/users', users);
    }
}


