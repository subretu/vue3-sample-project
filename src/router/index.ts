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
  {
    path: "/userlist2",
    name: "userlist2",
    component: () => import("../views/UserList2.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
