
const User = require("../models/user");

// Create a new user
const createUser = async (req, res) => {
  try {
    // Extract user data from the request body
    const { username, email, password } = req.body;

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Return the saved user data
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve all users
const getUser = async (req, res) => {
  try {
      // Assuming user ID is stored in decoded token
      const userId = req.user.userId;

      // Retrieve user data from the database
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Return user data
      res.status(200).json({ user });
  } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}
const Update_Test_Count = async (req, res) => {
  try {
    const { TestType, userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentMonth = new Date().getMonth();
    // Increment total tests count
    user.Total_tests += 1;

    // Increment specific test type count
    switch (TestType) {
      case 'AI':
        user.No_AI_interview += 1;
        user.AI_interview_monthlyScores[currentMonth] += 1;
        break;
      case 'Written':
        user.No_Written_test += 1;
        user.Written_test_monthlyScores[currentMonth] += 1;
        break;
      case 'Voice':
        user.No_Voice_test += 1;
        user.Voice_test_monthlyScores[currentMonth] += 1;
        break;
      default:
        return res.status(400).json({ error: 'Invalid test type' });
    }

    // Save the updated user document
    await user.save();

    return res.status(200).json({ message: 'Test count updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getAllUsers = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();

    // Return the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve a single user by ID
const getUserById = async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const userId = req.params.id;

    // Retrieve the user from the database by ID
    const user = await User.findById(userId);

    // If user not found, return 404 error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a user by ID
const updateUserById = async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const userId = req.params.id;

    // Extract updated user data from the request body
    const { username, email, password } = req.body;

    // Find the user by ID and update its data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, password },
      { new: true }
    );

    // If user not found, return 404 error
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a user by ID
const deleteUserById = async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const userId = req.params.id;

    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);

    // If user not found, return 404 error
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return a success message
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  Update_Test_Count,
};
