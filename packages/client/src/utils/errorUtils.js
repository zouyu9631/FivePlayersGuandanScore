export function logError(error, context = '') {
  console.error(`[${context}]`, error);
}

export function safeExecute(fn, args = [], defaultValue = null, context = '') {
  try {
    return fn(...args);
  } catch (error) {
    logError(error, context);
    return defaultValue;
  }
}

export function safeParseJSON(jsonString, defaultValue = null) {
  return safeExecute(JSON.parse, [jsonString], defaultValue, 'JSON解析');
}
