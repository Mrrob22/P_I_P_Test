const {Router} = require ('express')
const router = Router()
const Card = require('../models/Card')
const {validationResult, check} = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require('../middleware/auth.middleware')

router.post(
    '/generate-card',
    auth,
    async (req, res) => {

        try {
        const condition = true
        // console.log('req.body =', req.body)
        const { card_number, cvv, expiration_date} = req.body

        const generateCard = new Card({
            card_number: card_number,
            cvv: cvv,
            expiration_date: expiration_date
        });


        res.json( generateCard )

        // console.log('card = ', generateCard)

        await generateCard.save();
        // console.log('Card saved successfully');

       res.json({ message: 'Card saved successfully'});
        if (condition) {
            return res.status(200).json({ message: 'Success' });
        } else {
            return res.status(400).json({ error: 'Bad request' });
        }


    } catch (e){

    }
})

router.get('/',auth, async (req, res) => {
    try {
        const cards = await Card.find({ owner: req.user.userId }) /// ????
        res.json(cards)
    } catch (e){
        res.status(500).json({message: 'Что-то пошло не так, пробуйте снова (500 error)'})
    }
})

router.get('/:id',auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id)
        res.json(card)
    } catch (e){
        res.status(500).json({message: 'Что-то пошло не так, пробуйте снова (500 error)'})
    }
})

module.exports = router