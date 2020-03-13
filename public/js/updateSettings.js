import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/update-my-password'
        : '/api/v1/users/update-me';

    const updatedUser = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (updatedUser.data.status === 'Success') {
      showAlert('success', `${type.toUpperCase()} UPDATED SUCCESSFULLY.`);
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
