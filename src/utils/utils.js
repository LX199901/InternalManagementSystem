// utils.js

/**
 * 格式化数字为货币字符串
 * @param {number} number - 需要格式化的数字
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(number) {
  // 确保传入的是数字
  if (isNaN(number)) {
    return "";
  }
  // 将数字转换为字符串，并添加千位分隔符
  const formattedNumber = number
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // 添加日元符号
  return `¥${formattedNumber}`;
}
