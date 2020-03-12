import axios from 'axios';

export const createResort = async (data, followUpData) => {
  try {
    const newResort = await axios({
      method: 'POST',
      url: '/api/v1/resorts',
      data
    });

    const updateResort = await axios({
      method: 'PATCH',
      url: `/api/v1/resorts/${newResort.data.data.resort._id}/update-created-resort`,
      data: {
        operationHours: followUpData.operationHours,
        contactNumbers: followUpData.contact,
        price: followUpData.price,
        location: followUpData.location
      }
    });

    if (updateResort.data.status === 'Success') {
      alert('Resort Created Successfully.');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

export const updateResort = async (data, slug) => {
  try {
    const updatedResort = await axios({
      method: 'PATCH',
      url: `/resort/${slug}`,
      data
    });

    if (updatedResort.data.status === 'Success') {
      alert('Updating Resort Successful.');
      window.setTimeout(() => {
        location.assign(`/resort/${slug}`);
      }, 1000);
    }
  } catch (err) {
    alert(err.response.data.stack);
  }
};
