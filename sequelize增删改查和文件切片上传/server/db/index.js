import * as dotenv from 'dotenv'
import path from 'path'
import { Sequelize,DataTypes } from 'sequelize'

const {USERNAME, PASSWORD, DATABASE, HOST, PORT} = dotenv.config().parsed||{}
// const db = process.env.DATABASE

// console.log(USERNAME, PASSWORD, DATABASE, HOST, PORT);
const seq = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  port: +PORT,
  dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  timezone: '+08:00', // 修改时区东八区
  // dialectOptions: {
  //   dateStrings: true, // for reading from database
  //   typeCast: true,
  // },
  // define: {
  //   charset: 'utf8mb4_general_ci',
  //   freezeTableName: true,
  // },
})

// export default seq

// 测试连接
seq.authenticate().then(() => {
  console.log('ok')
}).catch(() => {
  console.log('err')
})
// 创建模型并同步数据表
// 创建 UserModel 模型
export const UserModel = seq.define('user', {
  userName: {
    type: Sequelize.STRING,
    allowNull: false,//不允许为空/必传
      comment: '用户名'
    },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '密码'
  },
  nickName: {
    type: DataTypes.STRING,
    comment: '昵称'
  },
  record_status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '逻辑删除;0 正常 1 已删除',
  },
  // id 会自动创建，并设为主键、自增
  // 会自动创建 createdAt updatedAt
})
// 执行同步
// 创建表：force 值为 true 时，表示每次执行这个方法都会先将表给删掉，再重新创建
// 创建表：force 值为 false 时，如果数据库表不存在，则创建数据库表，如果存在，则不做任何操作
seq.sync({ force: false })
