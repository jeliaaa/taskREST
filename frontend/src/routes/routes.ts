// import type { ComponentType } from 'react'
// import Main from './pages/Main'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Profile from './pages/Profile'

// export type AppRoute = {
//   path: string
//   component: ComponentType
//   requireAuth?: boolean
//   name?: string
// }

// export const allRoutes: AppRoute[] = [
//   { path: '/', component: Main, requireAuth: false, name: 'Main' },
//   { path: '/login', component: Login, requireAuth: false, name: 'Login' },
//   { path: '/register', component: Register, requireAuth: false, name: 'Register' },
//   { path: '/profile', component: Profile, requireAuth: true, name: 'Profile' },
// ]

// export const publicRoutes = allRoutes.filter((r) => !r.requireAuth)
// export const protectedRoutes = allRoutes.filter((r) => r.requireAuth)


export const PublicRoutes = {
  login: "/login",
  register: "/register",
};

export const privateRoutes = {
  main: "/",
  quizs: "/quizs",
  quizStart: "/quiz/:catId/:id/",
  quizSingle: "/quiz/:catId/:id/:attemptId",
  quizResult: "/quiz/result/:attemptId",
  leaderboard: "/leaderboard",
  settings: "/settings",
  profile: "/profile",
  videoLessons: "/videoLessons",
  chat: "/chat",
  test: "/test",
  news: "/news",
  newsSingle: "/news/:id",
};

export const routes = {
  ...PublicRoutes,
  ...privateRoutes,
};