const handleManagerError = (error, username = "unknown user") => {
  if (error.response) {
    if (error.response.status === 404) {
      const message = `Error: User '${username}' not found on GitHub`;
      console.error(message);
      return message;
    } else {
      const message = `GitHub API Error: ${error.response.status} - ${
        error.response.statusText || "Error: Network Error"
      }`;
      console.error(message);
      return message;
    }
  } else if (error.request) {
    const message = "Error: No response from GitHub API - Network Error";
    console.error(message);
    return message;
  } else {
    const message = `Error: ${error.message || "Network Error"}`;
    console.error(message);
    return message;
  }
};

module.exports = {
  handleManagerError,
};
