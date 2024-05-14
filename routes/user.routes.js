const { Router } = require('express');
const router = Router();
const User = require('../models/User');

router.get('/userData/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
