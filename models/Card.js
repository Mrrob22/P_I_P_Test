const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    // from: {type: String, required: true},
    // to: {type: String, required: true, unique: true},
    // code: {type: String, required: true, unique: true},
    // date: {type: Date, default: Date.now},
    card_number: {
        type: String,
        // required: true,
        //  unique: true
    },
    cvv: {
        type: String,
        // required: true
    },
    expiration_date: {
        type: String,
        // required: true
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = model('Card', schema)