import { Router } from 'express'
import { productModel } from "../dao/models/products.model.js"
import { cartModel } from "../dao/models/carts.model.js"

const router = Router()

router.post("/", async (req, res) => {
    try {
        const cart = req.body
        const addCart = await cartModel.create(cart)
        res.json({ status: 'success', payload: addCart })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const pid = req.params.pid
        const product = await productModel.findById(pid)
        if (!product) {
            res.status(404).json({ error: "Producto no válido" })
        }
        const cid = req.params.cid
        const cart = await cartModel.findById(cid)
        if (!cart) {
            res.status(404).json({ error: "Carrito no válido" })
        }
        const existingProductIndex = cart.products.findIndex(
            (item) => item.product.toString() === pid
        )
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1
        } else {
            const newProduct = {
                product: pid,
                quantity: 1,
            }
            cart.products.push(newProduct)
        }
        const result = await cart.save()
        res.json({ status: 'success', payload: result })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findById(cartId)
        if (!cart) {
            res.status(404).json({ error: `El carrito con id ${cartId} no existe` })
        } 
        res.send(cart)
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router