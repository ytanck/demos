// const multiparty = require("multiparty");
// const bodyParser = require("body-parser");
// const path = require("path");
// const express = require("express");
// const router = express.Router()
// const app = express();
// const cors = require('cors')
// const fs = require("fs");
import path from 'path'
import multiparty from 'multiparty'
import express from 'express'
const router = express.Router()
import bodyParser from 'body-parser'
import cors from 'cors'
import fs from 'fs'
const app = express();
import { UserModel } from './db/index'

function resolvePath(dir) {
  return path.join(__dirname, dir);
}
app.use(cors())
app.use(express.static(resolvePath("/public")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/get',async function(req,res){
  console.log(req.query,req.body);
  // 条件查询
  const where = {} 
  if(req.query.id){
    where.id=req.query.id
  }
  try {
  const users = await UserModel.findAll({where:where})
  res.send({ users, code: 200 });
  } catch (error) {
    res.send({ error, code: 500 });
  }
})
// 新增
app.post('/add',async function(req,res){
  console.log(req.query,req.body);
  const body = req.body
  try {
  const user = await UserModel.create({...body})
  console.log(user.dataValues);
  res.send({ msg:'ok', code: 200 });
  } catch (error) {
    res.send({ error, code: 500 });
  }
})
// 更新
app.post('/updata',async function(req,res){
  console.log(req.query,req.body);
  const id = req.query.id
  const userName=req.body.userName
  try {
    const result = await UserModel.update({
      userName,
    }, {
      where: {
        id,
      },
    })
    if(result[0] > 0){
      res.send({ msg:'ok', code: 200 });
    }else{
      res.send({ msg:'fail', code: 200 });
    }
  } catch (error) {
    res.send({ error, code: 500 });
  }
})
// 删除(物理真删除)
app.post('/delete',async function(req,res){
  console.log(req.query,req.body);
  const id = req.query.id
  try {
    const result = await UserModel.destroy( {
      where: {
        id,
      },
    })
    // console.log('result',result);
    if(result > 0){
      res.send({ msg:'ok', code: 200 });
    }else{
      // 删除之前应该先判断这条数据是否存在。to do...
      res.send({ msg:'no-id', code: 200 });
    }
  } catch (error) {
    res.send({ error, code: 500 });
  }
})

// 文件上传
app.post("/upload", function (req, res) {
  const form = new multiparty.Form({ uploadDir: "public" });
  form.parse(req);
  form.on("file", function (name, file) {
    // console.log(name, file);
    const { path, originalFilename } = file;
    fs.renameSync(path, `temp/${originalFilename}`);
    res.json({
      url: `http://localhost:9528/${originalFilename}`,
      message: "upload发送成功",
    });
  });
});
app.post("/merge", function (req, res) {
  const { fileName, hexHash, extName } = req.body;
  const readDir = fs.readdirSync(resolvePath("temp"));
  readDir.sort((a, b) => a - b).map(chunkPath => {
    // 同步将temp里的chunk数据追加到public/${fileName}文件中，如果文件尚不存在则创建该文件
      fs.appendFileSync(
          resolvePath(`public/${fileName}`),
          fs.readFileSync(resolvePath(`temp/${chunkPath}`))
      );
      // 删除temp下的chunk
      fs.rmSync(resolvePath(`temp/${chunkPath}`));
  });
  // fs.rmdirSync(resolvePath("temp"));
  res.json({
      url: `http://localhost:9528/${fileName}`,
      message: "merge发送成功"
  });
});


app.use(function (err, req, res, next) {
  console.log('server-err',err);
  res.send({
    err:err,
    message: "server错误"
  })
})
app.use('', router)
const port = 9528;
app.listen(port, function () {
  console.log(`listen port ${port}`);
});
