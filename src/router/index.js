import { createRouter, createWebHistory } from "vue-router";
import Layout from "../components/Layout.vue";
import { isAuthenticated, getToken, clearSession } from "../services/session";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: () => import("../views/Login.vue"),
      meta: { title: "Masuk" },
    },
    {
      path: "/",
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        { path: "", redirect: "/dashboard" },
        {
          path: "dashboard",
          component: () => import("../views/Dashboard.vue"),
          meta: { title: "Dashboard" },
        },
        {
          path: "products",
          component: () => import("../views/Products.vue"),
          meta: { title: "Master Produk" },
        },
        {
          path: "transactions",
          component: () => import("../views/Transactions.vue"),
          meta: { title: "Transaksi" },
        },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/dashboard" },
  ],
});

// Route guard: halaman admin butuh token yang masih berlaku.
router.beforeEach((to) => {
  const loggedIn = isAuthenticated();
  if (to.matched.some((r) => r.meta.requiresAuth) && !loggedIn) {
    if (getToken()) clearSession();
    return {
      path: "/login",
      query:
        to.fullPath !== "/dashboard" && to.fullPath !== "/"
          ? { redirect: to.fullPath }
          : {},
    };
  }
  if (to.path === "/login" && loggedIn) return "/dashboard";
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} - Admin Penjualan`
    : "Admin Penjualan";
});

export default router;
