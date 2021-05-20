import Vue from 'vue'

import { login, logout, getInfo, xxx_login, getOauthInfo } from '@/api/user'
import { getToken, setToken, removeToken, removeLoginType } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  id: 0,
  name: '',
  email: '',
  phone: '',
  avatar: '',
  introduction: '',
  roles: [],
  loginType: undefined
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_LOGIN_TYPE: (state, loginType) => {
    state.loginType = loginType
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  xxx_login({ commit }, data) {
    const { loginType } = data
    commit('SET_LOGIN_TYPE', loginType)

    return new Promise((resolve, reject) => {
      xxx_login({}).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // const { roles, name, avatar, introduction, id, email, phone } = data
        const { id, roles, name, email, phone, avatar, introduction, model, policy } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        console.log('getInfo', roles)
        commit('SET_ID', id)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_EMAIL', email)
        commit('SET_PHONE', phone)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        Vue.$localStorage.set('model_text', model || '')
        Vue.$localStorage.set('policy_text', policy || '')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getOauthInfo({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      getOauthInfo(data).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { id, roles, name, email, phone, avatar, introduction, model, policy } = data

        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ID', id)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_EMAIL', email)
        commit('SET_PHONE', phone)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        Vue.$localStorage.set('model_text', model || '')
        Vue.$localStorage.set('policy_text', policy || '')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeLoginType()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
