import mongoose from "mongoose"

const messagesCollection = 'messages'

const messageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true }
}, {
    versionKey: false
})

mongoose.set('strictQuery', false)
export const messageModel = mongoose.model(messagesCollection, messageSchema)
