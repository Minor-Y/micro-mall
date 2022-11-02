const jwt = require('jsonwebtoken')
const signkey = 'minorhan'

// 生成token
exports.setToken = (data, time) => { // data加密数据
        return jwt.sign(data, signkey, {expiresIn: time})
    },
// 解析验证token
exports.verToken = (token) => {
        try {
            let data = jwt.verify(token, signkey)
            return {
                token: true,
                data: data
            }
        } catch (err) {
            return {
                token: false,
                data: err
            }
        }
    }