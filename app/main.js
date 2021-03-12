//Node Constants
const ws = require('./config/ws.js')
require('colors')

//Express Routers
const users = require('./data/users/router')

init()

function init() {
    ws.server.listen(ws.port, () => {
        console.log("Server is running on", `${ws.port}`.yellow)
        initRouters()
        console.log("API server is", "operational.".green)
    })
    ws.app.use(ws.express.json());
    ws.app.use(ws.express.urlencoded({extended: false}))
}


function initRouters() {
    ws.app.use('/users', users);
}



