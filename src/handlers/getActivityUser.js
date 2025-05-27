const { default: axios } = require("axios");
const { handleManagerError } = require("./errorHandler");

//GET user activity for github
const getUserActivity = async (username) => {
  try {
    const BASE_URL = `https://api.github.com/users/${username}/events`;
    const response = await axios.get(BASE_URL);

    return response.data.map((activity) => {
      return {
        type: activity.type,
        name: activity.repo.name,
      };
    });
  } catch (error) {
    handleManagerError(error, username);
    return null;
  }
};

module.exports = {
  getUserActivity,
};
