import { Schema, model } from "mongoose";
import { nanoid }        from "nanoid";

const ticketsCollection = 'tickets'

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid(10)
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})

export default model(ticketsCollection, ticketSchema)