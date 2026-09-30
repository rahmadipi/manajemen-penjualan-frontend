const number = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });
const dateTime = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const shortDay = new Intl.DateTimeFormat("id-ID", {
  weekday: "short",
  day: "numeric",
});
const longDate = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const formatNumber = (n) => number.format(Number(n) || 0);
export const formatRupiah = (n) => `Rp ${number.format(Number(n) || 0)}`;
export const formatDateTime = (d) => (d ? dateTime.format(new Date(d)) : "-");
export const formatLongDate = (d = new Date()) => longDate.format(d);
// "2026-09-29" -> "Sel 29"
export const formatShortDay = (key) =>
  shortDay.format(new Date(`${key}T00:00:00`));

// Nilai untuk <input type="datetime-local"> (waktu lokal browser)
export function toLocalInput(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function debounce(fn, wait = 300) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
