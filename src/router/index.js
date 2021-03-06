import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/index',
    name: 'data',
    meta: {
      title: '数据',
      icon: 'documentation'
    },
    children: [
      {
        path: 'jszb',
        component: () => import('@/views/data/jszb'),
        name: 'jszb',
        meta: { title: '技术指标' }
      },
      {
        path: 'zjlx',
        component: () => import('@/views/data/zjlx'),
        name: 'zjlx',
        meta: { title: '资金流向' }
      },
      {
        path: 'bond',
        component: () => import('@/views/data/bond'),
        name: 'bond',
        meta: { title: '可转债比价表' }
      },
      {
        path: 'jgdytj',
        component: () => import('@/views/data/jgdytj'),
        name: 'jgdytj',
        meta: { title: '机构调研统计' }
      },
      {
        path: 'yjbg',
        component: () => import('@/views/data/yjbg'),
        name: 'yjbg',
        meta: { title: '研究报告' }
      }
    ]
  },
  {
    path: '/strategy',
    component: Layout,
    redirect: '/strategy/index',
    name: 'strategy',
    meta: {
      title: '策略',
      icon: 'guide'
    },
    children: [
      {
        path: 'index-ma',
        component: () => import('@/views/strategy/ma-higher/index-ma'),
        name: 'index-ma',
        meta: { title: '指数均线多头' }
      },
      {
        path: 'stock-ma',
        component: () => import('@/views/strategy/ma-higher/stock-ma'),
        name: 'stock-ma',
        meta: { title: '个股均线多头' }
      },
      {
        path: 'over-sold-new-stock',
        component: () => import('@/views/strategy/over-sold-new-stock/over-sold-new-stock'),
        name: 'over-sold-new-stock',
        meta: { title: '超跌次新买卖策略' }
      },
      {
        path: 'n2s-sign',
        component: () => import('@/views/strategy/n2s/n2s-sign'),
        name: 'n2s-sign',
        meta: { title: '北向资金均值买卖策略' }
      },
      {
        path: 'n2s-sign-test',
        component: () => import('@/views/strategy/n2s/n2s-sign-test'),
        name: 'n2s-sign-test',
        meta: { title: '北向资金均值策略回测' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = []

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
