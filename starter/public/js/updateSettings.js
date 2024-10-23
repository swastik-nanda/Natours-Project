import axios from 'axios';
import { showAlert } from '../js/alert';

// type is either password or data updateMyPassword
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url: url,
      data: data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
    if (type === 'photo') {
      return res.data.data.user.photo;
    }
  } catch (err) {
    const errorMessage =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Something went wrong.';

    showAlert('error', errorMessage);
    console.error(err.response ? err.response.data : err); // Log full error object for debugging
  }
};
