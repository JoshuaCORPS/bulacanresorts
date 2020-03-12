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
      alert(`${type.toUpperCase()} updated successfully.`);
      location.reload(true);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};
