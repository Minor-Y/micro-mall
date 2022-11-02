// 时间戳转换时间日期函数
export function transformTime(time) {
  if (!time) return null
  if(time.toString().length === 10) {
    time *= 1000
  }
  let date = new Date(parseInt(time))
  const format = {
    year: date.getFullYear().toString(),
    month: [date.getMonth() + 1].toString(),
    day: date.getDate().toString(),
    hour: date.getHours().toString(),
    minutes: date.getMinutes().toString(),
    seconds: date.getSeconds().toString(),
  }
  return `${format.year}-${
    format.month.length === 1 ? format.month.padStart(2, '0') : format.month
  }-${format.day.length === 1 ? format.day.padStart(2, '0') : format.day} ${
    format.hour.length === 1 ? format.hour.padStart(2, '0') : format.hour
  }:${
    format.minutes.length === 1
      ? format.minutes.padStart(2, '0')
      : format.minutes
  }:${
    format.seconds.length === 1
      ? format.seconds.padStart(2, '0')
      : format.seconds
  }`
}