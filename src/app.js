import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import productsRouter from './routers/products.routes.js'
import cartsRouter from './routers/carts.routes.js'
import viewsRouter from './routers/views.routes.js'
import multer from 'multer'

const app = express()           
const PORT = 8080

const httpServer = app.listen(PORT, () => console.log(`Server Express on Port ${PORT}`))
const io = new Server(httpServer)
app.set('socketio', io)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public'))

// Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

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

app.get('/', (req, res) => res.render('index', {name: 'Andrea'}))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/home', viewsRouter)

io.on('connection', socket => {
    console.log('A new client has connected to the Server')
    socket.on('productList', data => {
        io.emit('updatedProducts', data)
    })
})