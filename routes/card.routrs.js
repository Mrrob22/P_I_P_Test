const {Router} = require ('express')
const router = Router()
const Card = require('../models/Card')
const {validationResult} = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require('../middleware/auth.middleware')

router.post('/generate-card',auth, async (req, res) => {
    try {
        const { cardNumber, cvv, expirationDate } = req.body
        const generatedCard = {
            cardNumber,
            cvv,
            expirationDate
        }
        res.json({ generatedCard })
    } catch (e){
        res.status(500).json({message: 'Что-то пошло не так, пробуйте снова (500 error)'})
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