import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPass = async email => {
  try {
    const sendEmail = await axios({
      method: 'POST',
      url: '/api/v1/users/forgot-password',
      data: {
        email
      }
    });

    if (sendEmail.data.status === 'Success') {
      showAlert(
        'success',
        "We've sent you an email with a link to reset your password."
      );
      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPass = async (password, passwordConfirm, token) => {
  try {
    const url = `/api/v1/users/reset-password/${token}`;

    const reset = await axios({
      method: 'PATCH',
      url,
      data: {
        password,
        passwordConfirm
      }
    });

    if (reset.data.status === 'Success') {
      showAlert('success', 'Password Reset Success');
      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
