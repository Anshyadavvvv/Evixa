import mongoose from "mongoose";
import OTP from "./OTP.js";
import User from "./user.js";
import Booking from "./Booking.js";

const eventSchema =new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    category : {
        type : String,
        required : true,    
    },
    totalSeats : {
        type : Number,
        required : true,    
    },
    availableSeats : {
        type : Number,
        required : true,    
    },
    ticketPrice : {
        type : Number,
        required : true,
    },
    imageURL : {
        type : String,
        required : true,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },


},{timestamps : true});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
