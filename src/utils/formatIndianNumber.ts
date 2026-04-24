/**
 * Format number in Indian numbering system (lakhs/crores)
 * Examples:
 * 123 → 123
 * 1234 → 1,234
 * 12345 → 12,345
 * 123456 → 1,23,456
 * 1234567 → 12,34,567
 * 12345678 → 1,23,45,678
 */
export function formatIndianNumber(num: number | string): string {
  const numStr = num.toString();
  
  // Split into integer and decimal parts
  const parts = numStr.split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Handle negative numbers
  const isNegative = integerPart.startsWith('-');
  if (isNegative) {
    integerPart = integerPart.substring(1);
  }

  // Indian numbering: last 3 digits, then groups of 2
  let result = '';
  
  if (integerPart.length <= 3) {
    result = integerPart;
  } else {
    // Get last 3 digits
    const lastThree = integerPart.substring(integerPart.length - 3);
    const remaining = integerPart.substring(0, integerPart.length - 3);
    
    // Add commas every 2 digits for remaining
    result = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  // Add negative sign back if needed
  if (isNegative) {
    result = '-' + result;
  }

  // Add decimal part if exists
  if (decimalPart) {
    result += '.' + decimalPart;
  }

  return result;
}
