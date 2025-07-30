const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        trim: true
    },
    lastName:{
        type: String,
        trim: true
    },
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"]
    },
    phone:{
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\d{10,15}$/, "Please enter a valid phone number"],
    },
    gender:{
        type: String,
        enum: ["male", "female"],
        // required: true
    },
    avatar:{
        type: String,
        default: null,
        match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, "Please enter a valid URL"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    role: {
        type: String,
        enum: ["admin", "employee", "customer", "supplier"],
        required: true,
        default: "customer"   
    },
    department: {
        type: String,
        enum: ["Stain Removal", "Dry-Cleaning", "Ironing", "Laundry", "Delivery"],
        default: "Laundry"
    },
   
}, {timestamps: true});

const userModel = mongoose.model('User', userSchema)
module.exports = userModel;
