import { createRouter, createWebHistory } from "vue-router";
import RosterView from "../views/RosterView.vue";
import StudentProfileView from "../views/StudentProfileView.vue";

// Two real pages, not a modal over the table. Advisors refresh / share a student URL.
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "roster", component: RosterView },
    {
      path: "/students/:studentId",
      name: "student",
      component: StudentProfileView,
      props: true, // so the profile doesn't have to dig through $route
    },
    // Fat-fingered URLs just dump you back on the roster. Fine for a demo.
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
