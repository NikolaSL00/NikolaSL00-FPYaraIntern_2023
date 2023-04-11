export function dateFormatter(date) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}
