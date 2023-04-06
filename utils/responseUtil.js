module.exports = {
  getResult: async (status, message, data = null) => {
    return {
      status: status,
      msg: message,
      data: data,
    };
  },
};
