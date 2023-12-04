// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/userlist",
    name: "userlist",
    component: () => import("../views/UserList.vue"),
  },
  {
    path: "/fileupload",
    name: "fileupload",
    component: () => import("../views/FileUpload.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
