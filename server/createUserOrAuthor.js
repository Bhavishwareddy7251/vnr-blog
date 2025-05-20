const userAuthorModel = require('./MODELS/userAuthorModel');

async function createUserOrAuthor(req, res) {
    try {
        const newUser = req.body;

        // Destructure only allowed fields
        const {
            role,
            firstName,
            lastName,
            email,
            profileImageUrl,
            isActive
        } = newUser;

        // Check if user exists
        let userInDb = await userAuthorModel.findOne({ email: email });

        if (!userInDb) {
            // Create new user with validated fields
            const userToSave = new userAuthorModel({
                role,
                firstName,
                lastName,
                email,
                profileImageUrl,
                isActive
            });

            const newUserOrAuthorDoc = await userToSave.save();
            return res.status(201).send({
                message: newUserOrAuthorDoc.role,
                payload: newUserOrAuthorDoc
            });
        }

        // Check role match
        if (newUser.role === userInDb.role) {
            return res.status(200).send({
                message: userInDb.role,
                payload: userInDb
            });
        }

        return res.status(400).send({
            message: 'Invalid Role',
            payload: 'Error: A different role is already assigned to this user.'
        });

    } catch (error) {
        console.error('Error in createUserOrAuthor:', error);
        
        // More specific error messages
        if (error.name === 'ValidationError') {
            return res.status(400).send({
                message: 'Validation Error',
                error: error.message
            });
        }

        return res.status(500).send({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

module.exports = createUserOrAuthor;
