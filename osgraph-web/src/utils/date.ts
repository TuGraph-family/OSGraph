/**
 * file: basic date utils
 * author: Allen
*/

const timestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const dateToTimestamp = (dateString: string): number => {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
}

const getLast10YearsTimestampsInSeconds = () => {
  const now = new Date();
  
  // 最近10年的结束时间戳为当前时间的时间戳（以秒为单位）
  const endTimestamp = Math.floor(now.getTime() / 1000);

  // 获取准确的10年前的同一时间的日期对象
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(now.getFullYear() - 10);

  // 10年前的时间戳（以秒为单位）
  const startTimestamp = Math.floor(tenYearsAgo.getTime() / 1000);

  return {
    startTimestamp,
    endTimestamp
  };
}

export {
  timestampToDate,
  dateToTimestamp,
  getLast10YearsTimestampsInSeconds,
};