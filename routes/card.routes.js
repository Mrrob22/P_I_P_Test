const { Router } = require('express');
const router = Router();
const Card = require('../models/Card');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

router.get('/', auth, async (req, res) => {

    try {
        if (req.user.role !== 2) {
            const cards = await Card.find();
            res.json(cards);
        } else {
            const cards = await Card.find({ owner: req.params.id });
            res.json(cards);
        }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, пробуйте снова (500 error)' });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        res.json(card);
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, пробуйте снова (500 error)' });
    }
});

router.get('/user/:id', auth, async (req, res) => {
    try {
        const card = await Card.find( {owner: req.params.id });
        res.json(card);
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, пробуйте снова (500 error)' });
    }
});

router.put('/:id',  async (req, res) => {
    const { id } = req.params;
    const { card_number, cvv, expiration_date } = req.body;

    try {
        const updatedCard = await Card.findByIdAndUpdate(
            id,
            { card_number, cvv, expiration_date },
            { new: true }
        );

        if (!updatedCard) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json({ message: 'Card updated successfully', updatedCard });
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ error: 'An error occurred while updating the card' });
    }
});

router.put('/updateCards/:userId/:cardId', async (req, res) => {
    const { userId, cardId } = req.params;

    try {
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

router.post('/', auth, async (req, res) => {
    try {
        const { card_number, cvv, expiration_date } = req.body;

        const generateCard = new Card({
            card_number,
            cvv,
            expiration_date,
            owner: req.user.userId
        });

        const result = await generateCard.save();

        res.status(201).json({ message: 'Card saved successfully', result });
    } catch (error) {
        console.error('Error saving card:', error);
        res.status(500).json({ error: 'An error occurred while saving the card' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const cardId = req.params.id;

        const deletedCard = await Card.findByIdAndDelete(cardId);

        if (!deletedCard) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: deletedCard.owner },
            { $pull: { cards: cardId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ message: 'An error occurred while deleting the card' });
    }
});

module.exports = router;