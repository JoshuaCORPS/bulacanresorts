import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const loginResult = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (loginResult.data.status === 'Success') {
      showAlert('success', 'Log in Success.', 1);
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 1);
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const newUser = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (newUser.data.status === 'Success') {
      showAlert('success', 'Sign up Successful.');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    await axios('/api/v1/users/logout');
    window.setTimeout(() => {
      location.assign('/');
    }, 1000);
  } catch (err) {
    alert(err.response.data.message);
  }
};
