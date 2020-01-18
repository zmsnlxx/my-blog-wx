

const checkResp = resp => {
  if (resp && (resp.code === 0 || resp.code === 1)) {
      if (resp.data !== null) {
          return resp.data;
      }
      return resp;
  }
  wx.showModal({
    title: resp.data,
    content: '',
    showCancel: true,
  });
  return Promise.reject(resp);
};

module.exports = {
    checkResp,
};
