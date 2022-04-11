
import Home from "./components/pages/Home.vue";

import VueRouter from "vue-router";
import firebase from 'firebase'

import store from "./store"

const routes = [
    {
        path: "/",
        component: Home,
        name: "home"
    },
    // {
    //     path: "/userProfile",
    //     component: UserProfile,
    //     name: "userProfile",
    //     // protezione della rotta se non loggato
    //     beforeEnter: (to, from, next) => {
    //         if (to.name !== 'login' && localStorage.getItem("isLoggedIn") === "false") next({ name: 'home' })
    //         else next()
    //     }
    // },
    // { path: '*', component: NotFound }
]

const router = new VueRouter({
    mode: 'history',
    routes,
})

// mi serve per scrollare sempre al top quando cambio rotta
router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);

    // More code ...
    next();
});

export default router;
