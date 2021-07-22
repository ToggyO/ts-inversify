module.exports = {
  files: {
    settings: {
      profileImage: {
        width: 'auto',
        responsive: 'true',
        min_width: 400,
        max_width: 1000,
        transformation: [{ gravity: 'face', crop: 'scale' }],
      },
    },
  },
};
