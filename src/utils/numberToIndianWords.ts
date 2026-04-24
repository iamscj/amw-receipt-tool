import { toWords } from 'number-to-words';

/**
 * Converts a number to Indian English words (using Lakhs and Crores)
 * @param num - The number to convert
 * @returns The number in Indian English words with proper capitalization
 */
export function numberToIndianWords(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToIndianWords(Math.abs(num));

  // Handle decimal numbers
  if (!Number.isInteger(num)) {
    const [integerPart, decimalPart] = num.toString().split('.');
    const integerWords = numberToIndianWords(parseInt(integerPart));
    const decimalWords = decimalPart
      .split('')
      .map((digit) => toWords(parseInt(digit)))
      .join(' ');
    return `${integerWords} Point ${decimalWords}`;
  }

  // Indian numbering system breakdown
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const remainder = num % 100;

  const parts: string[] = [];

  if (crore > 0) {
    parts.push(toWords(crore) + ' Crore');
  }

  if (lakh > 0) {
    parts.push(toWords(lakh) + ' Lakh');
  }

  if (thousand > 0) {
    parts.push(toWords(thousand) + ' Thousand');
  }

  if (hundred > 0) {
    parts.push(toWords(hundred) + ' Hundred');
  }

  if (remainder > 0) {
    parts.push(toWords(remainder));
  }

  // Join parts and capitalize properly
  const result = parts.join(' ');
  return result.charAt(0).toUpperCase() + result.slice(1);
}
