
const tokens = {
  'admin@xxx.com': {
    token: 'admin-token'
  },
  'editor@xxx.com': {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // user roles info
  {
    url: '/user/role_info_list',
    type: 'post',
    response: _ => {
      const role_list = [{name: 'admin', description: 'admin'}]
      return {
        code: 20000,
        data: role_list
      }
    }
  },

  // user log
  {
    url: '/user/log',
    type: 'post',
    response: _ => {
      const logs = [{"id":2,"owner":2,"log_type":"logout","log_content":"logout","create_time":"2021-05-19 17:33:28"},{"id":1,"owner":2,"log_type":"login","log_content":"login","create_time":"2021-05-19 17:33:24"}]
      return {
        code: 20000,
        data: logs
      }
    }
  }
]
