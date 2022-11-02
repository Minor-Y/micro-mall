const db = require('../db/index')

const addArticle = (bodys) => {
    let userID = parseInt(bodys.uid)
    let betime = Number(Date.now().toString().slice(0, 10)) // 获取当前时间，并截取至10位-秒数
    querySql = 'SELECT customerId, customerName, customer_avatar FROM customerList WHERE customerId = ?'
    sql = 'INSERT INTO article (imgurl, customer_id, customer_name, customer_avatar, article_title, article_contents, createtime) value (?,?,?,?,?,?,?)'
    db.query(querySql, userID , (err, result) => {
        console.log(result)
        if(err) {
            console.log(err)
        } else {
            if(bodys.backImageUrl === '' || bodys.backImageUrl === null) {
                return console.log('图片路径错误或不存在')
            }
            let backImg = bodys.backImageUrl.toString() + ','
            let params = [backImg, result[0].customerId, result[0].customerName, result[0].customer_avatar, bodys.article_title, bodys.article_contents, betime]
            db.query(sql, params, (err, resl) => {
                console.log(resl)
                if(err) {
                    console.log(err)
                }
            })
        }
    })
}

module.exports = {addArticle}