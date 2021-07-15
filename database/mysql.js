const mysql = require('mysql');
const database = require('./config.js')

const pool  = mysql.createPool({
  host     : database.HOST,
  user     : database.USER,
  password : database.PASS,
  database : database.DB,
  port     : database.PORT
});

let query = ( sql, values ) => {

  return new Promise(( resolve, reject ) => {
    pool.getConnection( (err, connection) => {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })

}

let user =
    `create table if not exists user(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '用户名',
     pass VARCHAR(100) NOT NULL COMMENT '密码',
     avator VARCHAR(100) NOT NULL COMMENT '头像',
     moment VARCHAR(100) NOT NULL COMMENT '注册时间',
     PRIMARY KEY ( id )
    );`

let article =
    `create table if not exists article(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '文章作者',
     title TEXT(0) NOT NULL COMMENT '评论题目',
     content TEXT(0) NOT NULL COMMENT '评论内容',
     md TEXT(0) NOT NULL COMMENT 'markdown',
     uid VARCHAR(40) NOT NULL COMMENT '用户id',
     moment VARCHAR(100) NOT NULL COMMENT '发表时间',
     comments VARCHAR(200) NOT NULL DEFAULT '0' COMMENT '文章评论数',
     pv VARCHAR(40) NOT NULL DEFAULT '0' COMMENT '浏览量',
     avator VARCHAR(100) NOT NULL COMMENT '用户头像',
     PRIMARY KEY(id)
    );`

let comment =
    `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '用户名称',
     content TEXT(0) NOT NULL COMMENT '评论内容',
     moment VARCHAR(40) NOT NULL COMMENT '评论时间',
     postid VARCHAR(40) NOT NULL COMMENT '文章id',
     avator VARCHAR(100) NOT NULL COMMENT '用户头像',
     PRIMARY KEY(id) 
    );`

let createTable = ( sql ) => {
  return query( sql, [] )
}

// 建表
createTable(user)
createTable(article)
createTable(comment)

// 注册用户
exports.registerUser = ( value ) => {
  let sqlStatement = "insert into user set name=?,pass=?,avator=?,moment=?;"
  return query( sqlStatement, value )
}
// 删除用户
exports.deleteUser = ( name ) => {
  let sqlStatement = `delete from user where name="${name}";`
  return query( sqlStatement )
}
// 查找用户
exports.findUser = ( name ) => {
  let sqlStatement = `select * from user where name="${name}";`
  return query( sqlStatement )
}
// 发表文章
exports.insertArticle = ( value ) => {
  let sqlStatement = "insert into article set name=?,title=?,content=?,md=?,uid=?,moment=?,avator=?;"
  return query( sqlStatement, value )
}
// 增加文章评论数
exports.addArticleCommentCount = ( value ) => {
  let sqlStatement = "update article set comments = comments + 1 where id=?"
  return query( sqlStatement, value )
}
// 减少文章评论数
exports.reduceArticleCommentCount = ( value ) => {
  let sqlStatement = "update article set comments = comments - 1 where id=?"
  return query( sqlStatement, value )
}

// 更新浏览数
exports.updateArticlePv = ( value ) => {
  let sqlStatement = "update article set pv= pv + 1 where id=?"
  return query( sqlStatement, value )
}

// 发表评论
exports.insertComment = ( value ) => {
  let sqlStatement = "insert into comment set name=?,content=?,moment=?,postid=?,avator=?;"
  return query( sqlStatement, value )
}
// 通过名字查找用户
exports.findDataByName =  ( name ) => {
  let sqlStatement = `select * from user where name="${name}";`
  return query( sqlStatement)
}
// 通过名字查找用户数量判断是否已经存在
exports.findDataCountByName =  ( name ) => {
  let sqlStatement = `select count(*) as count from user where name="${name}";`
  return query( sqlStatement)
}
// 通过文章的名字查找用户
exports.findDataByUser =  ( name ) => {
  let sqlStatement = `select * from article where name="${name}";`
  return query( sqlStatement)
}
// 通过文章id查找
exports.findDataById =  ( id ) => {
  let sqlStatement = `select * from article where id="${id}";`
  return query( sqlStatement)
}
// 通过文章id查找
exports.findCommentById =  ( id ) => {
  let sqlStatement = `select * from comment where postid="${id}";`
  return query( sqlStatement)
}

// 通过文章id查找评论数
exports.findCommentCountById =  ( id ) => {
  let sqlStatement = `select count(*) as count from comment where postid="${id}";`
  return query( sqlStatement)
}

// 通过评论id查找
exports.findComment = ( id ) => {
  let sqlStatement = `select * from comment where id="${id}";`
  return query( sqlStatement)
}
// 查询所有文章
exports.findAllPost = () => {
  let sqlStatement = `select * from article;`
  return query( sqlStatement)
}
// 查询所有文章数量
exports.findAllPostCount = () => {
  let sqlStatement = `select count(*) as count from article;`
  return query( sqlStatement)
}
// 查询分页文章
exports.findPostByPage = ( page ) => {
  let sqlStatement = ` select * from article limit ${(page-1)*10},10;`
  return query( sqlStatement)
}
// 查询所有个人用户文章数量
exports.findPostCountByName = (name) => {
  let sqlStatement = `select count(*) as count from article where name="${name}";`
  return query( sqlStatement)
}
// 查询个人分页文章
exports.findPostByUserPage = (name,page) => {
  let sqlStatement = ` select * from article where name="${name}" order by id desc limit ${(page-1)*10},10 ;`
  return query( sqlStatement)
}
// 更新修改文章
exports.updatePost = (values) => {
  let sqlStatement = `update article set title=?,content=?,md=? where id=?`
  return query(sqlStatement,values)
}
// 删除文章
exports.deletePost = (id) => {
  let sqlStatement = `delete from article where id = ${id}`
  return query(sqlStatement)
}
// 删除评论
exports.deleteComment = (id) => {
  let sqlStatement = `delete from comment where id=${id}`
  return query(sqlStatement)
}
// 删除所有评论
exports.deleteAllPostComment = (id) => {
  let sqlStatement = `delete from comment where postid=${id}`
  return query(sqlStatement)
}

// 滚动无限加载数据
exports.findPageById = (page) => {
  let sqlStatement = `select * from article limit ${(page-1)*5},5;`
  return query(sqlStatement)
}
// 评论分页
exports.findCommentByPage = (page,postId) => {
  let sqlStatement = `select * from comment where postid=${postId} order by id desc limit ${(page-1)*10},10;`
  return query(sqlStatement)
}



