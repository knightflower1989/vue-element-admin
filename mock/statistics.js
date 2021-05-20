module.exports = [
  // user login
  {
    url: '/statistics/statistics',
    type: 'post',
    response: config => {
      
      const data = {
        code_number: 16, 
        user_number: 2
      }

      return {
        code: 20000,
        data: data
      }
    }
  }
]