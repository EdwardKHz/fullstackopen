const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    number: {
        type: String,
        required: true,
        minlength: 8,
        validate: v => /^\d{2,3}-\d+$/.test(v)
    }
})

module.exports = mongoose.model('Person', personSchema)
