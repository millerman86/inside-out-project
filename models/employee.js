const { ObjectId } = require('bson')
const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const employeeSchema = new Schema({
    idNumber: {
        type: ObjectId, 
    }, 
    firstName: {
        type: String, 
        required: true
    }, 
    lastName: {
        type: String, 
        required: true, 
    }, 
    email: {
        type: String, 
        required: true
    }, 
    phone: {
        type: String, 
        required: false
    }
})

module.exports = mongoose.model("Employee", employeeSchema)