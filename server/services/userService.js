const User = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');

const createUser = async (userData) => {
  const { name, email, password, team } = userData;
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('A user with that email has already been registered!');
  }
  let passwordDigest = await authMiddleware.hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: passwordDigest,
    team
  });
  return user;
};

const test = async () => {
  const user = {
    name: 'Shoaib Farooka',
    email: 'shoaibfarooka@gmail.com',
    password: '12345678',
    team: 'admin'
  };
  await createUser(user);
}

// test()

const loginUser = async (loginData) => {
  const { email, password } = loginData;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  let passwordMatched = await authMiddleware.comparePassword(user.password, password);
  if (!passwordMatched) {
    throw new Error('Unauthorized');
  }
  let payload = {
    id: user._id,
    email: user.email,
    team: user.team
  };
  let accessToken = authMiddleware.createAccessToken(payload);
  let refreshToken = authMiddleware.createRefreshToken(payload);
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }
  const payload = authMiddleware.verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new Error('Invalid refresh token');
  }
  const newPayload = { id: payload.id, email: payload.email, team: payload.team };
  const newAccessToken = authMiddleware.createAccessToken(newPayload);
  const newRefreshToken = authMiddleware.createRefreshToken(newPayload);
  user.refreshToken = newRefreshToken;
  await user.save();
  return { newAccessToken, newRefreshToken };
};

const logoutUser = async (refreshToken) => {
  const payload = authMiddleware.verifyRefreshToken(refreshToken);
  if (payload && payload.id) {
    const user = await User.findById(payload.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }
};

const fetchUser = async (userId) => {
  const userProjection = {
    password: false,
    refreshToken: false,
    createdAt: false,
    updatedAt: false,
    __v: false,
    _id: false
  };
  const user = await User.findById(userId, userProjection);
  if (!user) {
    throw new Error('User not found!');
  }
  return user;
};

const fetchAllUsers = async () => {
  const userProjection = {
    password: false,
    refreshToken: false,
    createdAt: false,
    updatedAt: false,
    __v: false,
  };
  const users = await User.find({ team: { $ne: 'admin' } }, userProjection);
  if (!users || users.length <= 0) {
    throw new Error('Users not found!');
  }
  return users;
};

const addUser = async (userData) => {
  const { name, email, password, team } = userData;
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('A user with that email has already been registered!');
  }
  let passwordDigest = await authMiddleware.hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: passwordDigest,
    team
  });
  if (!user) {
    throw new Error('Unable to add user');
  }
  return user;
};

const updateUser = async (userId, updateData) => {
  if (updateData.password) {
    updateData.password = await authMiddleware.hashPassword(updateData.password);
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  );
  if (!updatedUser) {
    throw new Error('Unable to update info');
  }
  return updatedUser;
};

const deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error('Unable to delete user');
  }
  return deletedUser;
};

const fetchAllUsersForEmail = async () => {
  const userProjection = {
    team: false,
    password: false,
    refreshToken: false,
    createdAt: false,
    updatedAt: false,
    __v: false,
    _id: false
  };
  const users = await User.find({}, userProjection);
  if (!users || users.length <= 0) {
    throw new Error('Users not found!');
  }
  return users;
};

module.exports = {
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
  fetchUser,
  fetchAllUsers,
  addUser,
  updateUser,
  deleteUser,
  fetchAllUsersForEmail
};
