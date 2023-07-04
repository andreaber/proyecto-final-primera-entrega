import mongoose from "mongoose"

const cartsCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            _id: false,
            product: mongoose.ObjectId,
            quantity: Number
        }],
        default: []
    }
}, {
    versionKey: false
})

mongoose.set('strictQuery', false)
export const cartModel = mongoose.model(cartsCollection, cartSchema)
