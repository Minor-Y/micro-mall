const db = require('../db/index')

const getMenus = (userId) => {
    return new Promise((resolve, reject) => {
        userSql = 'SELECT role FROM user WHERE userid = ?'
        roleSql = 'SELECT * FROM role WHERE rolename = ?'
        menuSql = 'SELECT * FROM menu'
        db.query(userSql, userId, (err, roles) => { // 根据登录用户id获取对应角色名称
            if (err) {
                console.log(err)
            } else {
                if (roles[0].role) {
                    console.log('roles:', roles[0].role)
                    db.query(roleSql, roles[0].role, (err, roleinfo) => {  // 根据角色名称获取角色对应的所有权限列表
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('roleinfo', roleinfo)
                            db.query(menuSql, (err, result) => {  // 获取所有的权限菜单项
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(result)
                                    const rolemenus = roleinfo[0]
                                    const rele = rolemenus.menus.split(',') // 权限ID数组
                                    console.log('menu数组:', rele)
                                    let menus = [] // 存放二级菜单权限列表
                                    let menuListOne = [] // 一级菜单列表
                                    result.forEach(item => {  // 获取所有二级菜单
                                        for (const menuid of rele) {
                                            if (item.id === parseInt(menuid)) {
                                                menus.push(item)
                                            }
                                        }
                                        if (item.pid === 0) {
                                            menuListOne.push(item)
                                        }
                                    })
                                    // 生成树形结构menu
                                    menuListOne.forEach(fas => {
                                        let child = []
                                        for (const fasT of menus) {
                                            if (fas.id === fasT.fas) {
                                                child.push(fasT)
                                            }
                                        }
                                        fas.childs = child
                                    })
                                    let menuListTwo =[]
                                    menuListOne.forEach(item1 => {
                                        if(item1.name !== '概览') {
                                            if(item1.childs.length !== 0) {
                                                menuListTwo.push(item1)
                                            }
                                        } else {
                                            menuListTwo.push(item1)
                                        }
                                    })
                                    console.log('push完children的数组:', menuListTwo)
                                    resolve(menuListTwo)
                                    console.log('二级菜单列表:', menus)

                                    
                                    // let menuListTwo = [] // 二级菜单列表
                                    // result.forEach(menu => { // 分别遍历保存一二级菜单
                                    //     if (menu.pid === 0) {
                                    //         menuListOne.push(menu)
                                    //     }
                                    // })



                                    // let menuListOne = [] // 一级菜单列表
                                    // let menuListTwo = [] // 二级菜单列表
                                    // menus.forEach(menu => { // 分别遍历保存一二级菜单
                                    //     if (menu.pid === 0) {
                                    //         menuListOne.push(menu)
                                    //     } else if (menu.pid === 1) {
                                    //         menuListTwo.push(menu)
                                    //     }
                                    // })
                                    // console.log('一级菜单', menuListOne)
                                    // // 生成树形结构menu
                                    // menuListOne.forEach(fas => {
                                    //     let child = []
                                    //     for (const fasT of menuListTwo) {
                                    //         if (fas.id === fasT.fas) {
                                    //             child.push(fasT)
                                    //         }
                                    //     }
                                    //     fas.childs = child
                                    // })
                                    // console.log('push完children的数组:', menuListOne)
                                    // resolve(menuListOne)
                                }
                            })
                        }
                    })

                } else {
                    console.log('用户角色未找到')
                }

            }
        })
    })
}

module.exports = { getMenus }