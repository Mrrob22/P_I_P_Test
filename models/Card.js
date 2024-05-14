const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    card_number: {
        type: String,

    },
    cvv: {
        type: String,
    },
    expiration_date: {
        type: String,
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Card', schema)