/**
 * 判断是否是中国手机号
 * @param phone 手机号
 * @returns
 */
function isChinesePhoneNumber(phone: string) {
  if (!phone) return false;
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

export default { isChinesePhoneNumber };
