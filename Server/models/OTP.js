import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: { 
         type: String,
            required: true,
    },
    action: {
        type: String,
        enum: ['account_verification', 'event_booking'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // OTP expires after 5 minutes

    }
});

const OTPModel = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
export default OTPModel;

