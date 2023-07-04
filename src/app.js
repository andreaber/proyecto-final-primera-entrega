import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import productsRouter from './routers/products.routes.js'
import cartsRouter from './routers/carts.routes.js'
import viewsProductsRouter from './routers/views.routes.js'
import { messageModel } from './dao/models/messages.model.js'
// import multer from 'multer'

const app = express()           
const PORT = 8080
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

try {
    await mongoose.connect('mongodb+srv://coder:coder@cluster0.3pbqlr5.mongodb.net/ecommerce')
    const httpServer = app.listen(PORT, () => console.log(`Server listening on Port ${PORT}`))
    const io = new Server(httpServer)
    app.set('socketio', io)

    app.use(express.static('./src/public'))
    // Handlebars
    app.engine('handlebars', handlebars.engine())
    app.set('views', './src/views')
    app.set('view engine', 'handlebars')

    app.get('/', (req, res) => res.render('index', {name: 'Coderhouse'}))

    app.use('/api/products', productsRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/home', viewsProductsRouter)

    io.on('connection', async (socket) => {
        console.log('A new client has connected to the Server')
        socket.on('productList', (data) => {
            io.emit('updatedProducts', data)
        })

        let messages = (await messageModel.find()) ? (await messageModel.find()) : []

        socket.broadcast.emit('alerta')
        socket.emit('logs', messages)
        socket.on('message', (data) => {
            messages.push(data)
            messageModel.create(messages)
            io.emit('logs', messages)
        })
    })
} catch(err) {
    console.log(`Cannot connect to dataBase: ${err}`)
    process.exit()
}


/*Muter
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/public')
    },
    filename: (req, file,cb) => {
        cb(null, file.originalname)
    }
})

const uploader = multer({ storage })

app.post('/', uploader.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', error: 'No se pudo cargar el archivo' })
    }
    res.json({ status: 'success', message: 'Archivo cargado correctamente' })
})
*/ 



