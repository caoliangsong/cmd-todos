/**
 * 数据来源leancloud
 * https://leancloud.cn/dashboard/login.html#/signin
 */

const AV = require('leancloud-storage');
AV.init({
  appId: "qX4p6N8UKyP3vOkBbXlth2Dr-gzGzoHsz",
  appKey: "u4WWzVMeGTw29vIOsH9pqATi",
  serverURL: "https://qx4p6n8u.lc-cn-n1-shared.com"
});

exports.formatDate = function (date, fmt = "yyyy-MM-dd") {
  let padLeftZero = (str) => ("00" + str).substr(str.length);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}
exports.AV = AV;






