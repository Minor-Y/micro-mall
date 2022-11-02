const db = require('../db/index')
const axios = require('axios')

const userLogin = (bodys) => {
    return new Promise(async (resolve, reject) => {
        let nikeName = bodys.nikeName
    let avatarUrl = bodys.avatarUrl
    const appid = 'wx0048a97a352b1f70' // 小程序appid
    const secret = 'ce6d6322a53b9829ba3aef3cc6c53664' // 小程序 appSecret
    let js_code = bodys.userCode
    // 通过 wx.login 接口获得临时登录凭证 code 后,调用此接口获得openid 用户唯一标识、session_key 会话密钥、unionid 用户在开放平台的唯一标识符
    let code2 = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
            appid: appid,
            secret: secret,
            js_code: js_code,
            grant_type: 'authorization_code'
        }
    })
    if(code2.errcode) {
        console.log(code2.errcode, code2.errmsg)
    }
    let betime = Number(Date.now().toString().slice(0, 10)) // 获取当前时间，并截取至10位-秒数
    let params = [nikeName, avatarUrl, betime, code2.data.openid, code2.data.unionid]
    let upParams = [nikeName, avatarUrl, code2.data.openid]
    let sql = 'INSERT INTO customerList (customerName, customer_avatar, becomeTime, openid, unionid) value (?,?,?,?,?)'
    let updateSql = 'UPDATE customerList SET customerName=?, customer_avatar=? WHERE openid=?'
    let checkSql = 'SELECT openid FROM customerList WHERE openid = ?'
    // 先判断当前授权用户库里是否已存在
    db.query(checkSql, code2.data.openid, (err, check) => {
        if(err) {
            console.log(err)
            reject(err)
        } else {
            if(check.length === 0) {
                db.query(sql, params, (err, result) => {
                    if(err) {
                        console.log(err)
                    } else {
                        result.openid = code2.data.openid
                        resolve(result)
                    }
                })
            } else {
                db.query(updateSql, upParams, (err, updata) => {
                    if(err) {
                        console.log(err)
                    } else {
                        console.log(updata)
                        resolve(updata)
                    }
                })
            }
        }
    })
    })
}

module.exports = { userLogin }