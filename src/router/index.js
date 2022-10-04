import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/components/Home.vue";
import SignIn from "@/components/SignIn";
import firebase from "firebase";
import ApplyToBeHost from "@/components/ApplyToBeHost";
import ApplyForAHost from "@/components/ApplyForAHost";
import UpdateTutor from "@/components/UpdateTutor";
import UpdateTutee from "@/components/UpdateTutee";
import Inbox from "@/components/Inbox";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/SignIn",
    name: "SignIn",
    component: SignIn,
    meta: {
      guest: true,
    },
  },
  {
    path: "/ApplyToBeHost",
    name: "ApplyToBeHost",
    component: ApplyToBeHost,
    meta: {
      auth: true,
    },
  },
  {
    path: "/UpdateHost",
    name: "UpdateHost",
    component: UpdateTutor,
    meta: {
      auth: true,
    },
  },
  {
    path: "/UpdateGuest",
    name: "UpdateGuest",
    component: UpdateTutee,
    meta: {
      auth: true,
    },
  },
  {
    path: "/OurPartners",
    name: "OurPartners",
    component: () => import("../components/OurPartners.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/questions",
    name: "questions",
    component: () => import("../components/Questions.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/askquestion",
    name: "askquestion",
    component: () => import("../components/AskQuestion.vue"),
  },

  {
    path: "/replies/:id",
    name: "Replies",
    component: () => import("../components/Replies.vue"),
  },
  {
    path: "/ApplyForAHost",
    name: "ApplyForAHost",
    component: ApplyForAHost,
    meta: {
      auth: true,
    },
  },
  {
    path: "/SearchHosts",
    name: "SearchHosts",
    component: () => import("../components/SearchHosts.vue"),
  },
  {
    path: "/Admin",
    name: "Admin",
    component: () => import("../components/Admin.vue"),
  },
  {
    path: "/ContactUs",
    name: "ContactUs",
    component: () => import("../components/ContactUs.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("../components/test.vue"),
  },

  {
    path: "/profile",
    name: "Profile",
    component: () => import("../components/Profile.vue"),
  },
  {
    path: "/Inbox",
    name: "Inbox",
    component: Inbox,
    meta: {
      auth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.auth)) {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        next({
          path: "/SignIn",
        });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

export default router;
