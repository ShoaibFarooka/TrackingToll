const yup = require('yup');
const mongoose = require('mongoose');

const ObjectId = yup.string().test('is-valid', 'Invalid user ID', value => mongoose.Types.ObjectId.isValid(value));

const registerSchema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().email('Invalid email address').trim().required('Email is required'),
  password: yup.string().trim().required('Password is required'),
}).noUnknown(true, 'Unknown field in registration data');

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').trim().required('Email is required'),
  password: yup.string().trim().required('Password is required'),
}).noUnknown(true, 'Unknown field in login data');

const updateUserInfoSchema = yup.object().shape({
  name: yup.string().trim(),
  email: yup.string().email('Invalid email address').trim(),
  password: yup.string().trim(),
  team: yup.string().trim(),
}).test('at-least-one', 'At least one field is required', function (value) {
  return Object.values(value).some(val => val !== undefined);
}).noUnknown(true, 'Unknown field in update user info');

const userIdSchema = yup.object().shape({
  userId: ObjectId.required('User ID is required'),
}).noUnknown(true, 'Unknown field in user ID');

const addUserSchema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().email('Invalid email address').trim().required('Email is required'),
  password: yup.string().trim().required('Password is required'),
  team: yup.string().trim().required('Team is required'),
}).noUnknown(true, 'Unknown field in add user data');

module.exports = {
  registerSchema,
  loginSchema,
  updateUserInfoSchema,
  userIdSchema,
  addUserSchema
};
