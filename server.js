const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4:uuidV4} = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req,res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room',(req,res) => {
  res.render('room',{roomId: req.params.room})
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    // socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.broadcast.to(roomId).emit('user-connected', userId)
    // console.log(roomId, userId)
    
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
})

// 
server.listen(3000)

// require("dotenv").config()


//===================Watson Chatbot============================
// //allow parsing on request bodies
// app.use(express.json())

// //import routes for api
// const watsonRoutes = require("./routes/api/watson")
// //direct requests to api/watson to Watson Routes
// app.use("/api/watson",watsonRoutes)


// //Start server
// const port = process.env.PORT || 5000
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })



//======================Initial Testing===============================
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// function error(status, msg) {
//   var err = new Error(msg);
//   err.status = status;
//   return err;
// }

// app.use(express.static('image'))

// var users = [
//   { name: 'tobi' }
// , { name: 'loki' }
// , { name: 'jane' }
// ];

// app.get('/api/users', function(req, res, next){
//   res.send(users);
// });


// // middleware with an arity of 4 are considered
// // error handling middleware. When you next(err)
// // it will be passed through the defined middleware
// // in order, but ONLY those with an arity of 4, ignoring
// // regular middleware.
// app.use(function(err, req, res, next){
//   // whatever you want here, feel free to populate
//   // properties on `err` to treat it differently in here.
//   console.log('ji')
//   res.status(err.status || 500);
//   res.send({ error: err.message });
// });

// // our custom JSON 404 middleware. Since it's placed last
// // it will be the last middleware called, if all others
// // invoke next() and do not respond.
// app.use(function(req, res){
//   console.log('ji23')
//   res.status(404);
//   res.send({ error: "Lame, can't find that" });
// });