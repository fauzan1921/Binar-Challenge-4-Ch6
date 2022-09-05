//catatan untuk reviewer/facil. Website tidak berfungsi 100%. fungsi score tidak bisa ditampilkan di web
//Saya sudah coba ulik sebisa mungkin, namun hingga masa deadline challenge, fungsi score ini
//belum juga bisa ditampilkan di web. Saya kumpulkan hasil kerja saya seadanya. Mohon maaf.

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//npm install node-fetch
//kalau tidak ada ini, di komputer saya akan keluar error 'fetch is not define' di API-API yg membutuhkan fetch
const fetch = require('node-fetch');

//pengenalan table dari database
const {user, user_biodata, user_history} = require('./models');

//pengenalan data statis
app.set('view engine', 'ejs')
app.use('/css', express.static(__dirname+'/css'))
app.use('/js', express.static(__dirname+'/js'))

//VIEWS
app.get('/login', (req,res) => {
  res.render('login')
})

//API untuk menampilkan username list ke dashboard.ejs
app.get('/dashboard', async (req,res) => {
const resp = await fetch('http://localhost:3000/user-list')
const data = await resp.json()

res.render('dashboard', { user: data })
})

//API untuk menampilkan laman '/userdata:id' sesuai dengan nomor id dari username yang di search pada fitur search by username
app.get('/userdata/:id', async (req,res) => {
const resp = await fetch(`http://localhost:3000/user-biodata/${req.params.id}`)
const resp1 = await fetch(`http://localhost:3000/user-score/${req.params.id}`)
const data = await resp.json()
const scoreData = await resp1.json()
res.render('userdata', { userInfo: data, userScore: scoreData })
})


//API CREATE
app.post('/new-user', jsonParser, async(req,res) => {
  try {
    //insert ke table user
  const username = await user.create({
    username: req.body.username
    })
    //insert ke table user_biodata
    const biodata = await user_biodata.create({
    age: req.body.age,
    city: req.body.city,
    nationality: req.body.nationality,
    userId: username.id
    })

    res.status(201).send('New User Created')
  } catch (error) {
    res.status(403).send('Failed')
  }
})

//API untuk add score. Kemungkinan BERMASALAH karena hanya bisa berfungsi sekali (tidak bisa add score, tapi malah update)
app.post('/new-score/:id', jsonParser, async(req,res) => {
  //insert ke table user_history
  const history = await user_history.create({
  score: req.body.score,
  userId: req.body.userId
  })
  res.status(201).send('Score has been added')
})

//API READ
//API untuk fitur 'search user info by username'
app.get('/search/:username', async (req,res) => {
  const data = await user.findOne({
    where: {
      username: req.params.username
    }
  })
  if(data != null){
    res.send(data)
  }else{
    res.status(404).send('User not found')
  }
})

//API untuk menampilkan semua username list di laman /dashboard
app.get('/user-list', async (req, res) => {
  const userList = await user.findAll()
  res.send(userList)
})

//API untuk menampilkan score milik user, kemungkinan BERMASALAH karena score tidak bisa ditampilkan di laman /userdata:id
app.get('/user-score/:id', async (req, res) => {
  const data = await user_history.findAll({
    where: {
    userId: req.params.id
    }
  })
  res.send(data)
})

//API untuk menampilkan biodata user di input pada laman /userdata:id
app.get('/user-biodata/:id', async (req, res) => {
  const data = await user.findByPk(req.params.id, {
    include: user_biodata
  })
  res.send(data)
})

//API UPDATE
//API untuk mengedit biodata user pada laman /userdata:id
app.put('/update-biodata/:id', jsonParser, async (req,res) => {
  const data = await user_biodata.findByPk(req.params.id)
  data.age = req.body.age
  data.city = req.body.city
  data.nationality = req.body.nationality
  data.save()
  res.status(202).send('Data has been updated')
})


//API DELETE
//API untuk menghapus user pada laman /dashboard
app.delete('/delete-user/:id', async(req,res) => {
  try {
    const menu = await user.findByPk(req.params.id)
    menu.destroy()
    res.status(202).send('Data has been deleted')
  } catch (error) {
    res.status(422).send('Unable to delete data')
  }
})


app.listen(3000, () => {
    console.log('Server is running in localhost:3000')
})