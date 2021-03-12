//Node Constants
const db = require('./config/database.js')
const ws = require('./config/ws.js')
require('colors')

//Express Routers
const users = require('./routers/userRouter')

init()

function init(){
    ws.server.listen(ws.port, ()=> {
        console.log("Server is running on", `${ws.port}`.yellow)
    })
    ws.app.use(ws.express.json());
    ws.app.use(ws.express.urlencoded({extended: false}))
    db.config();
    initRouters()

    function initRouters(){
        ws.app.use('/users', users);
    }
}


