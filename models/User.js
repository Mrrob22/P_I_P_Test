const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    },
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }]
})

module.exports = model('User', schema)