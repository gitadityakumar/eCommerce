export function numberToWords(num: number): string {
  if (num === 0)
    return 'Zero';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const doubleDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const format = (n: number): string => {
    if (n === 0)
      return '';
    if (n < 10)
      return singleDigits[n];
    if (n < 20)
      return doubleDigits[n - 10];
    if (n < 100)
      return `${tens[Math.floor(n / 10)]} ${singleDigits[n % 10]}`.trim();
    return `${singleDigits[Math.floor(n / 100)]} Hundred ${format(n % 100)}`.trim();
  };

  let words = '';

  if (Math.floor(num / 10000000) > 0) {
    words += `${format(Math.floor(num / 10000000))} Crore `;
    num %= 10000000;
  }

  if (Math.floor(num / 100000) > 0) {
    words += `${format(Math.floor(num / 100000))} Lakh `;
    num %= 100000;
  }

  if (Math.floor(num / 1000) > 0) {
    words += `${format(Math.floor(num / 1000))} Thousand `;
    num %= 1000;
  }

  words += format(num);

  return `${words.trim()} Rupees Only`;
}
