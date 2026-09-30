import api, { clean } from "./api";

export const getTransactions = (params) =>
  api.get("/transactions", { params: clean(params) }).then((r) => r.data);
export const createTransaction = (payload) =>
  api.post("/transactions", payload).then((r) => r.data);
