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
    '/',
    auth,
    async (req, res) => {

        try {
        const condition = true
        // console.log('req.body =', req.body)
        const { card_number, cvv, expiration_date} = req.body

        const generateCard = new Card({
            card_number: card_number,
            cvv: cvv,
            expiration_date: expiration_date,
            owner: req.user.userId
        });



        res.json( generateCard )

        // console.log('card = ', generateCard)

        const result =  await generateCard.save();

        if(result._id){

        }

        // console.log('Card saved successfully (result)', result);

       res.json({ message: 'Card saved successfully'});
        if (condition) {
            return res.status(200).json({ message: 'Success' });
        } else {
            return res.status(400).json({ error: 'Bad request' });
        }


    } catch (e){

    }
})

router.get('/', auth, async (req, res) => {
    try {
        const cards = await Card.find({ owner: req.user.userId });
        res.json(cards);
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, пробуйте снова (500 error)' });
    }
});

router.get('/:id',auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id)
        res.json(card)
    } catch (e){
        res.status(500).json({message: 'Что-то пошло не так, пробуйте снова (500 error)'})
    }
})

router.put('/updateCards/:userId/:cardId', async (req, res) => {
    const { userId, cardId } = req.params;

    try {
        // Find the user by ID and update the cards array with the new cardId
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $push: { cards: cardId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User cards array updated successfully', user });
    } catch (error) {
        console.error('Error updating user cards array:', error);
        return res.status(500).json({ error: 'An error occurred while updating user cards array' });
    }
});


module.exports = router