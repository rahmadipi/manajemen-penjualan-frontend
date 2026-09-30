import { reactive } from "vue";

const toasts = reactive([]);
let nextId = 0;

function remove(id) {
  const i = toasts.findIndex((t) => t.id === id);
  if (i > -1) toasts.splice(i, 1);
}

function push(type, message, timeout) {
  const id = ++nextId;
  toasts.push({ id, type, message });
  setTimeout(() => remove(id), timeout);
}

export function useToast() {
  return {
    toasts,
    remove,
    success: (message) => push("success", message, 3500),
    error: (message) => push("error", message, 6000),
    info: (message) => push("info", message, 3500),
  };
}
