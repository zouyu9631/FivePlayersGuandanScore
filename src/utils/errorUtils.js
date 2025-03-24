/**
 * 错误处理工具函数
 * 提供基本的错误捕获和处理机制
 */

/**
 * 在控制台记录错误
 * @param {Error} error - 错误对象
 * @param {string} context - 错误发生的上下文
 */
export function logError(error, context = '') {
  console.error(`[${context}]`, error);
}

/**
 * 安全地执行函数，捕获并处理任何错误
 * @param {Function} fn - 要执行的函数
 * @param {Array} args - 函数参数
 * @param {*} defaultValue - 错误时返回的默认值
 * @param {string} context - 错误上下文
 * @returns {*} 函数执行结果或默认值
 */
export function safeExecute(fn, args = [], defaultValue = null, context = '') {
  try {
    return fn(...args);
  } catch (error) {
    logError(error, context);
    return defaultValue;
  }
}

/**
 * 安全地解析JSON字符串
 * @param {string} jsonString - 要解析的JSON字符串
 * @param {*} defaultValue - 解析失败时返回的默认值
 * @returns {*} 解析结果或默认值
 */
export function safeParseJSON(jsonString, defaultValue = null) {
  return safeExecute(JSON.parse, [jsonString], defaultValue, 'JSON解析');
}
