export function createJid(number: string): string {
  if (!number) return '';

  if (
    number.includes('@g.us') ||
    number.includes('@s.whatsapp.net') ||
    number.includes('@broadcast') ||
    number.includes('@lid')
  ) {
    return number;
  }

  const cleaned = number.replace(/:\d+/g, '').replace(/\D/g, '');

  if (cleaned.length >= 18 || cleaned.includes('-')) {
    return `${cleaned}@g.us`;
  }

  const formatted = formatNumber(cleaned);
  return `${formatted}@s.whatsapp.net`;
}

function formatNumber(number: string): string {
  if (number.startsWith('52') && number.length === 13 && number[2] === '1') {
    return '52' + number.slice(3);
  }

  if (number.startsWith('54') && number.length === 13 && number[2] === '9') {
    return number;
  }
  if (number.startsWith('54') && number.length === 12) {
    return '54' + '9' + number.slice(2);
  }

  if (number.startsWith('55')) {
    return formatBRNumber(number);
  }

  return number;
}

function formatBRNumber(number: string): string {
  if (number.length === 13 && number.startsWith('55')) {
    const ddd = parseInt(number.slice(2, 4), 10);
    if (ddd >= 31) {
      return '55' + number.slice(2, 4) + number.slice(5);
    }
  }
  return number;
}

export function stripPhoneNumber(number: string): string {
  return number.replace(/\D/g, '');
}
