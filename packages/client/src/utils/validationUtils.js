export function validatePlayerName(name, existingNames = [], defaultName = '') {
  if (!name || !name.trim()) {
    return {
      isValid: false,
      message: '名称不能为空',
      processedName: defaultName
    };
  }
  
  const trimmedName = name.trim();
  
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const chineseChars = trimmedName.match(chineseRegex) || [];
  const chineseLength = chineseChars.length;
  const otherLength = trimmedName.length - chineseLength;
  
  if (chineseLength > 4 || (chineseLength * 2 + otherLength) > 8) {
    let result = '';
    let currentChineseCount = 0;
    let currentTotalLength = 0;
    
    for (const char of trimmedName) {
      const isChineseChar = /[\u4e00-\u9fa5]/.test(char);
      
      if (isChineseChar) {
        if (currentChineseCount < 4 && currentTotalLength < 8) {
          result += char;
          currentChineseCount++;
          currentTotalLength += 2;
        }
      } else {
        if (currentTotalLength < 8) {
          result += char;
          currentTotalLength++;
        }
      }
    }
    
    return {
      isValid: true,
      message: '名称已截断为适当长度',
      processedName: result
    };
  }
  
  if (existingNames.includes(trimmedName)) {
    let uniqueName = trimmedName;
    let counter = 1;
    
    while (existingNames.includes(uniqueName)) {
      uniqueName = `${trimmedName}${counter}`;
      counter++;
    }
    
    return {
      isValid: true,
      message: '名称已存在，已添加数字后缀',
      processedName: uniqueName
    };
  }
  
  return {
    isValid: true,
    message: '',
    processedName: trimmedName
  };
}
