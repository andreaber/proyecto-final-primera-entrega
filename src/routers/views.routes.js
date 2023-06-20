import { Router } from "express"
import { productManager } from "../controllers/ProductManager.js"

const router = Router()

const allProducts = await productManager.getProducts()

router.get("/", async (req, res) => {
    try {
        res.render("home", { allProducts })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
})

router.get("/realTimeProducts", async (req, res) => {
    try {
        res.render("realTimeProducts", { allProducts })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
})

export default router