const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const checkResp = resp => {
  if (resp && (resp.code === 0 || resp.code === 1)) {
      if (resp.data !== null) {
          return resp.data;
      }
      console.log(resp);
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
  formatTime,
  checkResp
}
