import dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef', 6);

export function generateOrderNumber() {
  const date = dayjs().format('YYYYMMDD');
  const id = nanoid();

  const orderNumber = `${date}-${id}`;
  return orderNumber;
}

export function currencyFormat(price) {
  const nf = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return nf.format(price);
}
