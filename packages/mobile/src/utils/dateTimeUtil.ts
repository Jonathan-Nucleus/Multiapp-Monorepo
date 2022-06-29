import dayjs from 'dayjs';

export function getPostTime(date: Date): string {
  const endDate = new Date();

  const secs = (endDate.getTime() - new Date(date).getTime()) / 1000;
  const mins = Math.floor(secs / 60);
  const hrs = Math.floor(mins / 60);
  if (secs <= 59) {
    return 'just now';
  } else if (mins >= 1 && mins <= 59) {
    return `${mins}m`;
  } else if (hrs >= 1 && hrs <= 23) {
    return `${hrs}h`;
  }

  return dayjs(date).format('MMM D');
}
