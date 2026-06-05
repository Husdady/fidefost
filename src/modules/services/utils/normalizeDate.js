export default function normalizeDate(value) {
  if (!value) return null;

  // si ya es Date
  if (value instanceof Date && !isNaN(value)) {
    return value;
  }

  let str = String(value)
    .replace(/^'/, "")
    .trim();

  const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);

  if (!match) return null;

  let [, day, month, year] = match;

  if (year.length === 2) {
    year = "20" + year;
  }

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return isNaN(date) ? null : date;
}