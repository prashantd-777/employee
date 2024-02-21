const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, "ID is required"]
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    city: {
        type: String,
        required: [true, "City is required"]
    }
}, {versionKey: false})

const EmployeeModel = mongoose.model("employees", EmployeeSchema);
module.exports = EmployeeModel 