import { reactive } from "vue";

export const confirmState = reactive({
  open: false,
  title: "",
  message: "",
  confirmText: "Ya",
  cancelText: "Batal",
  danger: false,
  resolve: null,
});

// Pemakaian: if (!(await confirm({ title, message, danger: true }))) return;
export function useConfirm() {
  const confirm = (options = {}) =>
    new Promise((resolve) => {
      Object.assign(confirmState, {
        open: true,
        title: options.title || "Konfirmasi",
        message: options.message || "",
        confirmText: options.confirmText || "Ya",
        cancelText: options.cancelText || "Batal",
        danger: Boolean(options.danger),
        resolve,
      });
    });
  return { confirm };
}

export function answerConfirm(value) {
  const resolve = confirmState.resolve;
  confirmState.open = false;
  confirmState.resolve = null;
  if (resolve) resolve(value);
}
