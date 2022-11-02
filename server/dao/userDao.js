const db = require('../db/index')

const selectUser = (params) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT userid,username,createtime FROM user WHERE username = ? AND password = ?'
        let sqlParams = [params.username, params.password]
        db.query(sql, sqlParams, (err, result) => {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message)
                reject(err)
                return
            }
            resolve(result)
        })
    })
}

module.exports = { selectUser }