const { MongoClient } = require('mongodb');
const config = require('config'); // Import your config file
const bcrypt = require('bcryptjs')

// Function to initialize the database
async function initializeDB() {
    const uri = config.get('mongoUri'); // Get the MongoDB URI from config

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();

        const db = client.db();
        const password = 'admin1234' // You can change this password

        const hash = await bcrypt.hash(password, 12)

        const user = {
            email: 'admin@gmail.com',
            password: hash,
            role: '1',
            cards: []
        };

        const existingUser = await db.collection('users').findOne({ email: user.email });

        if (!existingUser) {
            await db.collection('users').insertOne(user);
            console.log('User initialized successfully');
        } else {
            console.log('User already exists');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await client.close();
    }
}

initializeDB();