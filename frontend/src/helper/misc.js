export const format_timestamp_ms = (timestamp_ms) => {
  const date_object =  new Date(timestamp_ms)
  return date_object.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "/" + 
  (date_object.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "/" + 
  date_object.getFullYear() + " " + 
  date_object.toLocaleTimeString()
}
