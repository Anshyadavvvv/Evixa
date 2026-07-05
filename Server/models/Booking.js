import mongoose from "mongoose";
import Event from "./event.js";
import User from "./user.js";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['non_paid', 'paid'],
        default: 'non_paid',
    },
    amount: {
        type: Number,
        required: true,
    },
},{timestamps : true});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;