import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setToken, setLoginType, getLoginType } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getCasbinEnforce } from '@/utils/casbin'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  let token = to.query.token
  let loginType = to.query.login_type
  if (token !== undefined && loginType !== undefined) {
    setToken(token)
    setLoginType(loginType)
  } else {
    token = getToken()
    loginType = getLoginType()
  }

  if (token) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        getCasbinEnforce(function(enforcer) {
          if (enforcer === undefined) {
            next()
            return
          }
          enforcer.enforce(store.getters.name, to.path, 'post').then(async pass => {
            if (pass === true) {
              next()
            } else {
              Message.error('Has no permisssion Error')
              NProgress.done()
            }
          })
        })
      } else {
        try {
          let role_list = []
          // get user info
          if (loginType !== undefined && token !== undefined) {
            const data = { token: token, loginType: 'xxx_oauth' }
            const { roles } = await store.dispatch('user/getOauthInfo', data)
            role_list = roles
          } else {
            const { roles } = await store.dispatch('user/getInfo')
            role_list = roles
          }
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', role_list)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          console.log('error', error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
