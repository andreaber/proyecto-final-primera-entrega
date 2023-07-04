import { Router } from "express"
import { productModel } from "../dao/models/products.model.js"

const router = Router()

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit || 0
        const products = await productModel.find().limit(limit).lean().exec()
        res.status(200).json({ status: 'success', payload: products })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const product = await productModel.findById(pid).lean().exec()
        if (product === null) {
            return res.status(404).json({ status: 'error', error: `El producto con el id ${pid} no se ha encontrado` })
        } 
        res.status(200).json({ status: 'success', payload: product })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const product = req.body
        const addProduct = await productModel.create(product)
        const products = await productModel.find().lean().exec()
        req.app.get('socketio').emit('updatedProducts', products)
        res.status(201).json({ status: 'success', payload: addProduct })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        if (req.body.id !== pid && req.body.id !== undefined) {
            return res.status(404).json({ status: 'error', error: 'No se puede modificar el id del producto' } )
        }
        const updated = req.body 
        const productFind = await productModel.findById(pid)
        if (!productFind) {
            return res.status(404).json({ status: 'error', error: 'El producto no existe' })
        }
        await productModel.updateOne({ _id: pid}, updated)
        const updatedProducts = await productModel.find()
        req.app.get('socketio').emit('updatedProducts', updatedProducts)
        res.status(200).json({ message: `Actualizando el producto: ${productFind.title}` })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid
        const result = await productModel.findByIdAndDelete(productId)
        if (result === null) {
            res.status(404).json({ status: 'error', error: `No such product with id: ${productId}` })
        }
        const updatedProducts = await productModel.find().lean().exec()
        req.app.get('socketio').emit('updatedProducts', updatedProducts)
        res.status(200).json({ message: `Product with id ${productId} removed successfully`, products: updatedProducts })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router