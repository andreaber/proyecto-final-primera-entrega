import mongoose from "mongoose"

const productsCollection = 'products'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] }
}, {
    versionKey: false
})

mongoose.set('strictQuery', false)
export const productModel = mongoose.model(productsCollection, productSchema)
