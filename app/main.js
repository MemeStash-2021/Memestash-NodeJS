//Node Constants
const ops = require('./init')
const port = 8888

ops.server.listen(port, ()=> {
    console.log(`Server is running on ${port}`)
})

