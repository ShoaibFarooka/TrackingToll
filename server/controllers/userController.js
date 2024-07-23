const userService = require('../services/userService');

const Register = async (req, res) => {
  try {
    const DTO = { ...req.body };
    const user = await userService.registerUser(DTO);
    res.status(201).json({ user });
  } catch (error) {
    if (error.message === 'A user with that email has already been registered!') {
      res.status(409).send(error.message);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};

const Login = async (req, res) => {
  try {
    const DTO = { ...req.body };
    const { accessToken, refreshToken } = await userService.loginUser(DTO);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });
    res.status(200).json({ token: accessToken });
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).send(error.message);
    } else if (error.message === 'Unauthorized') {
      res.status(401).send(error.message);
    } else {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  }
};

const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const { newAccessToken, newRefreshToken } = await userService.refreshToken(refreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });
    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    if (error.message === 'Refresh token not found' || error.message === 'Invalid refresh token') {
      res.status(403).send(error.message);
    }
    else {
      console.log('Error: ', error);
      res.status(500).send('Internal Server Error');
    }
  }
};

const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await userService.logoutUser(refreshToken);
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });
    res.status(200).send('Logged out successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

const FetchUserInfo = async (req, res) => {
  try {
    const userId = res.locals.payload.id;
    const user = await userService.fetchUser(userId);
    res.status(200).json({ user });
  } catch (error) {
    if (error.message === 'User not found!') {
      res.status(404).send(error.message);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};

const FetchAllUsersInfo = async (req, res) => {
  try {
    const users = await userService.fetchAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    if (error.message === 'Users not found!') {
      res.status(404).send(error.message);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};

const AddUser = async (req, res) => {
  try {
    const DTO = { ...req.body };
    await userService.addUser(DTO);
    res.status(201).send('User created successfully');
  } catch (error) {
    if (error.message === 'Unable to add user') {
      res.status(400).send(error.message);
    } else if (error.message === 'A user with that email has already been registered!') {
      res.status(409).send(error.message);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};

const UpdateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const DTO = { ...req.body };
    await userService.updateUser(userId, DTO);
    res.status(200).send('User info updated successfully');
  } catch (error) {
    if (error.message === 'Unable to update info') {
      res.status(400).send(error.message);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};

const DeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await userService.deleteUser(userId);
    res.status(200).send('User deleted successfully');
  } catch (error) {
    if (error.message === 'Unable to delete user') {
      res.status(400).send(error.message);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};

module.exports = {
  Login,
  RefreshToken,
  Logout,
  Register,
  FetchUserInfo,
  FetchAllUsersInfo,
  AddUser,
  UpdateUser,
  DeleteUser,
};
