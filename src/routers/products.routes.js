import { Router } from "express"
import { productManager } from "../controllers/ProductManager.js"

const router = Router()

router.get('/', async (req, res) => {
    const limit = req.query.limt
    const products = await productManager.getProducts()
    if (limit) {
        const limitedProducts = products.slice(0, limit)
        res.json(limitedProducts)
    } else {
        res.json({ products : products})
    }
})

router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid)
    const product = await productManager.getProductsById(productId)
    if (!product) {
        return res.status(404).json({ error: `El producto con el id ${productId} no se ha encontrado` })
    } else {
        res.json({ product: product })
    }
})

router.post('/', async (req, res) => {
    try {
        let { title, description, code, price, stock, category, thumbnail, status } = req.body
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios'})
        }
        const addProduct = await productManager.addProduct(
            title,
            description,
            price,     
            thumbnail,
            code,
            category,
            stock,
            (status = true)
        )
        if (addProduct) {
            const products = await productManager.getProducts()
            req.app.get('socketio').emit('updatedProducts', products)
            return res.status(201).json({ message: 'Producto agregado con éxito', product: addProduct})
        }
        return res.status(404).json({ error: 'Error al agregar el producto' })
    } catch (error) {
        return res.status(500).json({ error: 'Error en el servidor' })
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid) 
        const products = await productManager.getProducts()
        if (req.body.id !== productId && req.body.id !== undefined) {
            return res.status(404).json({ error: 'No se puede modificar el id del producto' })
        }
        const updated = req.body
        const productFind = await products.find(item => item.id === productId)
        if (!productFind) {
            return res.status(404).json({ error: `No existe el producto con id: ${productId}` })
        }
        await productManager.updateProduct(productId, updated)
        const updatedProducts = await productManager.getProducts()
        req.app.get('socketio').emit('updatedProducts', updatedProducts)
        res.json({ message: `Actualización existosa del producto con id: ${productId}` })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)
        const products = await productManager.getProducts()
        const productFind = await products.find(item => item.id === productId)
        if (!productFind) {
            return res.status(404).json({ error: `No existe el producto con el id: ${productId}` })
        }
        const deleteProduct = await productManager.deleteProduct(productId)
        console.log(deleteProduct)
        const updatedProducts = await productManager.getProducts()
        req.app.get('socketio').emit('updatedProducts', updatedProducts)
        res.json({ message: `Producto con el ID ${productId} eliminado con éxito`, products: await productManager.getProducts() })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

export default router