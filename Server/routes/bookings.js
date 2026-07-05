import express from "express";
import { protect, admin } from "../middleware/auth.js";
const router = express.Router();
import { bookEvent, sendBookingOTP, getMyBookings, confirmBooking, cancelBooking } from "../controller/bookingcontroller.js";
router.post('/' , protect , bookEvent);
router.post('/send-otp' , protect , sendBookingOTP);
router.get('/my' , protect , getMyBookings);
router.put('/:id/confirm' , protect , admin , confirmBooking);
router.delete('/:id' , protect ,  cancelBooking);



export default router;


