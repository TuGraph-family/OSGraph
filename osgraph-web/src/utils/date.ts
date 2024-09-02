/**
 * file: basic date utils
 * author: Allen
*/

const timestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

const dateToTimestamp = (dateString: string): number => {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
}

export {
  timestampToDate,
  dateToTimestamp,
};