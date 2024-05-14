const { Router } = require('express');
const router = Router();
const Card = require('../models/Card');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

// Get all cards based on user role
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 2) {
            // If the user's role is not equal to 2, show all cards from MongoDB
            const cards = await Card.find();
            res.json(cards);
        } else {
            // If the user's role is equal to 2, show cards owned by the user
            const cards = await Card.find({ owner: req.user.userId });
            res.json(cards);
        }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, пробуйте снова (500 error)' });
    }
});

// Get a specific card by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const card = await Card.find( {owner: req.user.userId });
        res.json(card);
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, пробуйте снова (500 error)' });
    }
});

// Update user's cards array
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

// Add a new card
router.post('/', auth, async (req, res) => {
    try {
        // Extract card data from request body
        const { card_number, cvv, expiration_date } = req.body;

        // Create a new card instance
        const generateCard = new Card({
            card_number,
            cvv,
            expiration_date,
            owner: req.user.userId
        });

        // Save the new card to the database
        const result = await generateCard.save();

        // Return success response
        res.status(201).json({ message: 'Card saved successfully', result });
    } catch (error) {
        console.error('Error saving card:', error);
        res.status(500).json({ error: 'An error occurred while saving the card' });
    }
});

module.exports = router;