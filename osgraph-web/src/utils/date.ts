/**
 * file: basic date utils
 * author: Allen
 */

const timestampToDate = (timestamp: any): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const dateToTimestamp = (dateString: string): number => {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
};

const getLast10YearsTimestampsInSeconds = () => {
  const now = new Date();

  // The end timestamp of the last 10 years is the timestamp of the current time (in seconds)
  const endTimestamp = Math.floor(now.getTime() / 1000);

  // Get the exact date object of the same time 10 years ago
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(now.getFullYear() - 10);

  // Timestamp 10 years ago (in seconds)
  const startTimestamp = Math.floor(tenYearsAgo.getTime() / 1000);

  return {
    startTimestamp,
    endTimestamp,
  };
};

export { timestampToDate, dateToTimestamp, getLast10YearsTimestampsInSeconds };
