// Librarys
import dayjs from "libs/dayjs";

/**
 * Callback for format date
 * @param {Date} date Date
 * @returns {string} Formatted date
 */
export default function formatDate(date) {
  if (!date) return "-";

  const currentDate = dayjs(date);

  return `${currentDate.format("D")} de ${currentDate.format(
    "MMMM"
  )} del ${currentDate.format("YYYY")} a las ${currentDate.format("hh:mm a")}`;
}
