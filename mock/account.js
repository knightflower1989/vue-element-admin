const account_list = {
  total: 2,
  items: [
      {
          id: 1,
          nickname: "admin",
          email: "admin@xxx.com",
          password: "96e79218965eb72c92a549dd5a330112",
          phone: "2222",
          description: "1111",
          avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
          status: "published",
          group: 0,
          roles: "",
          create_time: "2021-05-08 18:00:00"
      },
      {
          id: 2,
          nickname: "shicai.xu",
          email: "shicai.xu@xxx.com",
          password: "96e79218965eb72c92a549dd5a330112",
          phone: "11111",
          description: "1111",
          avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
          status: "published",
          group: 0,
          roles: "",
          create_time: "2021-05-08 18:00:00"
      }
  ]
}

module.exports = [
  // account list
  {
    url: '/account/list',
    type: 'get',
    response: config => {

      return {
        code: 20000,
        data: account_list
      }
    }
  },

  // account create
  {
    url: '/account/create',
    type: 'post',
    response: config => {
      const { nickname, email, password, phone, avatar, description, status } = config.body
      const account = {
        id: account_list.total + 1,
        nickname: nickname,
        email: email,
        password: password,
        phone: phone,
        description: description,
        avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        status: status,
        group: 0,
        roles: "",
        create_time: "2021-05-08 18:00:00"
      }

      account_list.items.push(account)

      return {
        code: 20000,
        data: "success"
      }
    }
  },

  // account update
  {
    url: '/account/update',
    type: 'post',
    response: config => {
      const { id, nickname, email, password, phone, avatar, description, status } = config.body
      const account = {
        id: account_list.total + 1,
        nickname: nickname,
        email: email,
        password: password,
        phone: phone,
        description: description,
        avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        status: status,
        group: 0,
        roles: "",
        create_time: "2021-05-08 18:00:00"
      }

      account_list.items[id-1] = account

      return {
        code: 20000,
        data: "success"
      }
    }
  },

   // account modify_status
   {
    url: '/account/modify_status',
    type: 'post',
    response: config => {
      const { id, status } = config.query

      account_list.items[parseInt(id)-1]['status'] = status

      return {
        code: 20000,
        data: "success"
      }
    }
  },

  // account delete
  {
    url: '/account/delete',
    type: 'post',
    response: config => {
      const { id } = config.query

      account_list.items.splice(parseInt(id)-1)

      return {
        code: 20000,
        data: "success"
      }
    }
  }

]
