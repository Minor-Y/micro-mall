const express = require('express')
const cors = require('cors')
const db = require('./db/index')
const axios = require('axios')
const userDao = require('./dao/userDao')
const getMenu = require('./dao/getMenu')
const token = require('./tokenjwt/jwt')
const { expressjwt: jwt } = require('express-jwt')
const weatherDao = require('./dao/weatherDao')
const uniLogin = require('./dao/uniLogin')
const uniAddArticle = require('./dao/uniAddArticle')
const { getMenus } = require('./dao/getMenu')
const app = express()

app.use(cors())
app.use(express.json())
app.use(jwt({
    secret: 'minorhan', // 签名的密钥 或 PublicKey
    algorithms: ['HS256']
}).unless({
    path: ['/login', '/cityJson', '/viewpager', '/article', '/wxlogin', '/addArticle'] // 指定路径不经过 Token 解析
}))

db.connect((err) => {
    if (err) throw err
    console.log('连接成功')
})

// 用户登录接口
app.post('/login', (req, res) => {
    userDao.selectUser(req.body).then((result) => {
        if (result === '' || result.length === 0) {
            res.json({
                status: 404,
                message: '验证失败'
            })
            return
        }
        let rel = result[0]
        let authorization = token.setToken({ password: req.body.password }, 60 * 60 * 24)
        rel['authorization'] = authorization
        res.json({
            data: rel,
            status: 200,
            message: '验证通过'
        })
    }).catch(err => {
        console.log(err)
        res.json({
            code: 1,
            message: '验证失败'
        })
    })
})
// 保存操作记录
app.post('/addProcessLog', (req, res) => {
    console.log(req.body)
    const processlogList = req.body.processLogs
    let params = [processlogList.operate_account, processlogList.operate_module, processlogList.operate_time, processlogList.operate_ip, processlogList.operate_content, processlogList.operate_addr]
    let sql = 'INSERT INTO operate_log (operate_account, operate_module, operate_time, operate_ip, operate_content, operate_addr) VALUE (?,?,?,?,?,?)'
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.json({
                data: result,
                status: 200,
                message: '保存操作记录成功'
            })
        }
    })
})
// 获取操作记录
app.get('/getProcessLog', (req, res) => {
    console.log(req.query)
    let pagenum = req.query.pagenum  // 页码
    let pagesize = req.query.pagesize  // 当前页面展示条数
    let querys = req.query.query
    console.log(querys[1])
    let params = []
    let sql = ''
    let totalSql = ''
    if (querys === '') {
        sql = 'SELECT * FROM operate_log LIMIT ?, ?'
        params = [(parseInt(pagenum) - 1) * parseInt(pagesize), parseInt(pagesize)]
        totalSql = 'SELECT COUNT(*) AS total FROM operate_log'
    } else {
        sql = 'SELECT * FROM operate_log WHERE operate_time >= ? AND operate_time <= ? LIMIT ?, ?'
        params = [querys[0].slice(0, 10), querys[1].slice(0, 10), (parseInt(pagenum) - 1) * parseInt(pagesize), parseInt(pagesize)]
        totalSql = `SELECT count(*) AS total FROM (${sql}) AS x`
    }
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            db.query(totalSql, params, (err, totals) => {
                let total = totals[0].total
                res.json({
                    data: result,
                    status: 200,
                    message: '获取操作记录成功',
                    total: total
                })
            })
        }
    })
})
// 查询当前用户ip所在城市
app.get('/cityJson', async (req, res) => {
    const getCity = await axios.get('http://pv.sohu.com/cityjson?ie=utf-8')

    if (getCity.status !== 200) {
        console.log('请求失败')
    }
    res.json({
        data: getCity,
        status: 200,
        message: '查询成功'
    })
})
// 查询当前用户ip所在城市-太平洋网
app.get('/pconlineIp', async (req, res) => {
    const ip = req.query.cip
    if (ip) {
        const getIp = await axios.get(`https://api.vore.top/api/IPdata?ip=${ip}`)
        console.log('getip', getIp)
        if (getIp.status !== 200) {
            console.log('请求失败')
        }
        res.json({
            data: getIp.data,
            status: 200,
            message: '查询成功'
        })
    }
})
// 查询当前用户所在城市天气信息
app.get('/weatherInfo', (req, res) => {
    weatherDao.getWeatherInfo(req.query.location).then((result) => {
        if (result === '' || result.length === 0) {
            res.json({
                status: 404,
                message: '验证失败'
            })
            return
        }
        res.json({
            data: result,
            status: 200,
            message: '查询成功'
        })
    })
})

// 创建/order的get请求,实现分页，pagenum,pagesize
app.get('/order', (req, res) => {
    let pagenum = req.query.pagenum
    let pagesize = req.query.pagesize
    let querys = req.query.query
    let keyword = ''
    if (req.query.value === 'orderNum') {
        keyword = 'orderNum'
    } else if (req.query.value === 'memberName') {
        keyword = 'memberName'
    } else if (req.query.value === 'goodsName') {
        keyword = 'goodsName'
    } else {
        keyword = ''
    }
    const params = [(parseInt(pagenum) - 1) * parseInt(pagesize), parseInt(pagesize)]
    // 分页查询
    let sql = 'SELECT * FROM orderList limit ?,?'
    // 关键词模糊查询
    let querySql = `SELECT * FROM orderList WHERE ${keyword} LIKE "%${querys}%"`
    if (!querys) {
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                res.json({
                    code: 1,
                    message: '查询失败'
                })
            } else {
                // 获取数据总条数
                let sqlTotal = 'select count(*) as total from orderList'
                db.query(sqlTotal, (error, totalSum) => {
                    if (err) {
                        console.log(error)
                    } else {
                        let total = totalSum[0]['total']
                        res.json({
                            data: result,
                            status: 200,
                            total: total,
                            page_num: pagenum,
                            page_size: pagesize
                        })
                    }
                })
            }
        })
    } else {
        querySqls = querySql + ' limit ?,?'
        db.query(querySqls, params, (err, search) => {
            if (err) {
                console.log(err)
                res.json({
                    code: 2,
                    message: '查询失败'
                })
            } else {
                let sqlTotal = `select count(*) as total from (${querySql}) AS x`
                db.query(sqlTotal, (err, totalSum) => {
                    if (err) {
                        console.log(err)
                    } else {
                        total = totalSum[0]['total']
                        res.json({
                            data: search,
                            status: 200,
                            total: total
                        })
                    }
                })
            }
        })
    }

})
// 客户列表请求
app.get('/customerlist', (req, res) => {
    let pagenum = req.query.pagenum
    let pagesize = req.query.pagesize
    let querys = req.query.query
    let keyword = ''
    if (req.query.value === 'mobile') {
        keyword = 'mobile'
    } else if (req.query.value === 'customerName') {
        keyword = 'customerName'
    } else {
        keyword = ''
    }
    const params = [(parseInt(pagenum) - 1) * parseInt(pagesize), parseInt(pagesize)]
    // 分页查询
    let sql = 'SELECT * FROM customerList limit ?,?'
    // 关键词模糊查询
    let querySql = `SELECT * FROM customerList WHERE ${keyword} LIKE "%${querys}%"`
    if (!querys) {
        db.query(sql, params, (err, result) => {
            if (err) {
                res.json({
                    code: 1,
                    message: '查询失败'
                })
            } else {
                // 获取数据总条数
                let sqlTotal = 'select count(*) as total from customerList'
                db.query(sqlTotal, (err, totalSum) => {
                    if (err) {
                        console.log(err)
                    } else {
                        let total = totalSum[0]['total']
                        res.json({
                            data: result,
                            status: 200,
                            total: total,
                            page_num: pagenum,
                            page_size: pagesize
                        })
                    }

                })
            }
        })
    } else {
        let querySqls = querySql + 'limit ?,?'
        db.query(querySqls, params, (err, search) => {
            if (err) {
                res.json({
                    code: 2,
                    message: '查询失败'
                })
            } else {
                let sqlTotal = `select count(*) as total from (${querySql}) AS x`
                db.query(sqlTotal, (err, totalSum) => {
                    if (err) {
                        res.json({
                            code: 1,
                            message: '查询失败'
                        })
                    } else {
                        let total = totalSum[0]['total']
                        res.json({
                            data: search,
                            status: 200,
                            total: total
                        })
                    }
                })
            }
        })
    }
})
// 删除客户
app.delete('/customerlist/:customerId', (req, res) => {
    let Id = req.params.customerId
    let sql = 'DELETE FROM customerList WHERE customerId = ?'
    db.query(sql, Id, (err, result) => {
        if (err) {
            res.json({
                code: 1,
                message: '删除失败'
            })
        } else {
            res.json({
                data: result,
                status: 200,
                message: '删除成功'
            })
        }
    })
})
// 添加客户
app.post('/customerlist', (req, res) => {
    let birthday = req.body.birthday.toString()
    if (birthday.length === 13) {
        birthday = birthday / 1000
    }
    let params = [req.body.customerName, req.body.mobile, birthday, req.body.channel, req.body.becomeTime]
    const sql = 'INSERT INTO customerList (customerName, mobile, birthday, channel, becomeTime) value (?,?,?,?,?)'
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
            res.json({
                code: 1,
                message: '添加失败'
            })
        } else {
            res.json({
                data: result,
                status: 200,
                message: '添加成功'
            })
            console.log(result)
        }
    })
})
// 更新客户tag
app.put('/customerlist/:customerId', (req, res) => {
    let params = [req.body.tag, req.params.customerId]
    let sql = 'UPDATE customerList SET tag = ? WHERE customerId = ?'
    db.query(sql, params, (err, result) => {
        if (err) {
            res.json({
                code: 1,
                message: '更新tag失败'
            })
        } else {
            res.json({
                data: result,
                status: 200,
                message: '更新tag成功'
            })
        }
    })
})
// 账号列表
app.get('/accounts', (req, res) => {
    let pagenum = req.query.pagenum
    let pagesize = req.query.pagesize
    let querys = req.query.query
    let params = [(parseInt(pagenum) - 1) * parseInt(pagesize), parseInt(pagesize)]
    // 分页查询sql
    let sql = 'SELECT * FROM user limit ?, ?'
    let totalSql = 'SELECT COUNT(*) AS total FROM user'
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result)
            db.query(totalSql, (err, tota) => {
                if (err) {
                    console.log(err)
                } else {
                    let total = tota[0]['total']
                    res.json({
                        data: result,
                        status: 200,
                        message: '查询成功',
                        total: total
                    })
                }
            })
        }
    })
})
// 更新账号状态
app.put('/accounts/:userid', (req, res) => {
    console.log(req)
    let status = req.body.status === '开启' ? 1 : 0
    console.log(status)
    let params = [req.body.mobile, req.body.username, req.body.role, req.body.sex, status, req.body.introduction, req.params.userid]
    console.log(params)
    let sql = 'UPDATE user SET mobile = ?, username = ?, role = ?, sex = ?, status = ?, introduction = ? WHERE userid = ?'
    db.query(sql, params, (err, result) => {
        if (err) {
            res.json({
                code: 1,
                message: '更新status失败'
            })
        } else {
            res.json({
                data: result,
                status: 200,
                message: '更新status成功'
            })
        }
    })
})
// 添加账号
app.post('/accounts', (req, res) => {
    let nowDate = Date.now().toString().slice(0, 10)
    console.log(nowDate)
    let status = req.body.status === '开启' ? 1 : 0
    let params = [req.body.mobile, req.body.username, req.body.role, req.body.sex, status, req.body.introduction, nowDate]
    console.log(params)
    let sql = 'INSERT INTO user (mobile, username, role, sex, status, introduction, createtime) VALUE (?,?,?,?,?,?,?)'
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.json({
                data: result,
                status: 200,
                message: '添加账号成功'
            })
        }
    })
})
// 删除账号
app.delete('/accounts/:userid', (req, res) => {
    console.log(req.params.userid)
    let userId = req.params.userid
    let sql = 'DELETE FROM user WHERE userid = ?'
    db.query(sql, userId, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.json({
                data: result,
                status: 200,
                message: '删除账号成功'
            })
        }
    })
})

// 角色列表
app.get('/role', (req, res) => {
    let sql = 'SELECT * FROM role'
    let accountSql = 'SELECT COUNT(role) AS accRoleNum FROM user WHERE role = ?'
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result)
            async function getRole() {
                let roleList = []
                const rr = result.map(item => {
                    return new Promise((resolve, reject) => {
                        db.query(accountSql, item.rolename, (err, ress) => {
                            if (err) {
                                console.log(err)
                                reject(err)
                            } else {
                                console.log(ress)
                                item.accRoleNum = ress[0].accRoleNum
                                roleList.push(item)
                                resolve()
                            }
                        })
                    })
                });
                await Promise.all(rr)
                return roleList
            }
            getRole().then(rol => {
                console.log(rol)
                res.json({
                    data: rol,
                    status: 200,
                    message: '角色列表获取成功'
                })
            })
        }
    })
})
app.put('/role', (req, res) => {
    console.log(req.body)
    let params = [req.body.roleName, req.body.roleKeys.toString(), req.body.id]
    let sql = 'UPDATE role SET rolename = ?, menus = ? WHERE id = ?'
    let paramsU = [req.body.roleName, req.body.beforRoleName]
    let userSql = 'UPDATE user SET role = ? WHERE role = ?'
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result)
            db.query(userSql, paramsU, (err, s) => {
                if (err) {
                    console.log(err)
                } else {
                    res.json({
                        data: result,
                        status: 201,
                        message: '更新角色权限成功'
                    })
                }
            })
        }
    })
})
// 添加角色
app.post('/role', (req, res) => {
    let params = [req.body.roleName, req.body.roleKeys.toString()]
    let sql = 'INSERT INTO role (rolename, menus) value (?,?)'
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.json({
                data: result,
                status: 200,
                message: '添加角色成功'
            })
        }
    })
})

app.get('/menus', (req, res) => {
    console.log(req.query)
    if (req.query.userid) {
        getMenu.getMenus(req.query.userid).then(menuList => {
            console.log('获取的menu列表', menuList)
            res.json({
                data: menuList,
                status: 200,
                message: '角色权限获取成功'
            })
        })
    } else {
        const sql = 'SELECT * FROM menu'
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                let menuListOne = [] // 一级菜单列表
                let menuListTwo = [] // 二级菜单列表
                result.forEach(menu => { // 分别遍历保存一二级菜单
                    if (menu.pid === 0) {
                        menuListOne.push(menu)
                    } else if (menu.pid === 1) {
                        menuListTwo.push(menu)
                    }
                })
                console.log('一级菜单', menuListOne)
                // 生成树形结构menu
                menuListOne.forEach(fas => {
                    let child = []
                    for (const fasT of menuListTwo) {
                        if (fas.id === fasT.fas) {
                            child.push(fasT)
                        }
                    }
                    fas.childs = child
                })
                res.json({
                    data: menuListOne,
                    status: 200,
                    message: '角色权限获取成功'
                })
            }
        })
    }


})

// uniapp lunbo
app.get('/viewpager', (req, res) => {
    let sql = 'SELECT imgurl FROM carousel'
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            res.json({
                code: 1,
                message: '查询失败'
            })
        } else {
            res.json({
                data: result,
                status: 200,
                message: '查询成功'
            })
        }
    })
})

// uniapp 获取文章信息
app.get('/article', (req, res) => {
    if (!req.query.params) {
        let sql = 'SELECT * FROM article'
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err)
                res.json({
                    code: 1,
                    message: '查询失败'
                })
            } else {
                res.json({
                    data: result,
                    status: 200,
                    message: '查询成功'
                })
            }
        })
    } else {
        let articleId = req.query.params
        let sql = 'SELECT * FROM article WHERE article_id = ?' // 查询文章信息
        db.query(sql, articleId, (err, result) => {
            if (err) {
                console.log(err)
                res.json({
                    code: 1,
                    message: '查询失败'
                })
            } else {
                let commentSql = 'SELECT * FROM comment WHERE article_id = ?' // 查询文章对应的各条主评论
                db.query(commentSql, articleId, (err, commresult) => {
                    if (err) {
                        console.log(err)
                        res.json({
                            code: 1,
                            message: '查询失败'
                        })
                    }
                    // 获取评论的回复
                    async function getReply() {
                        let ress = []
                        const prom = commresult.map((item, index) => { // map最终返回的是一个数组集合
                            let comment_id = item.comment_id
                            let replySql = 'SELECT * FROM comment_reply WHERE comment_id = ?' // 查询主评论对应的回复评论
                            return new Promise((resolve, reject) => {
                                db.query(replySql, comment_id, (err, replyresult) => {
                                    if (err) {
                                        console.log(err)
                                        reject(err)
                                        res.json({
                                            code: 1,
                                            message: '查询失败'
                                        })
                                    } else {
                                        item.childs = replyresult
                                        ress.push(item) // 将单次获取的评论以及回复插入数组
                                        resolve(ress)
                                    }
                                })
                            })
                        })
                        // 因为使用了map，循环有多条promise，所以用await结合Promise.all来让所有请求结束之后方可执行后续代码
                        await Promise.all(prom)
                        return ress
                    }
                    getReply().then(re => {
                        result[0].comment = re
                        res.json({
                            data: result,
                            status: 200,
                            message: '查询成功'
                        })
                    })
                })
            }
        })
    }
})
// uniapp 微信小程序登录校验
app.post('/wxlogin', (req, res) => {
    let bo = req.body
    uniLogin.userLogin(bo).then(async (result) => {
        let authorization = token.setToken({ openid: result.openid }, 60 * 60 * 72) // 生成token,设置有效期时间
        let rel = {
            token: authorization,
            insertId: result.insertId
        }
        res.json({
            data: rel,
            status: 201,
            message: '用户添加成功'
        })
    }).catch(err => {
        console.log(err)
        res.json({
            code: 1,
            message: '添加失败'
        })
    })
})

// 添加文章笔记
app.post('/addArticle', (req, res) => {
    console.log(req.body)
    uniAddArticle.addArticle(req.body).then(result => {
        res.json({
            status: 200,
            message: '添加文章成功'
        })
    }).catch(err => {
        res.json({
            message: '添加文章失败'
        })
    })
})


// 错误处理
app.use(function (req, res, next) {
    res.status(404).send('Not found!')
})

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('token 过期')
        return
    }
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// 监听端口
app.listen(3000, () => {
    console.log('端口监听成功')
})