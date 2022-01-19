const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {
  allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access')

const { Sauce, Restaurant } = require('./models/sauce')
const { db } = require('./db')

const port = 3000

const app = express()

//configure handlebars library to work well w/ express + sequelize model
const handlebars = expressHandlebars({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
})
//tell this express app that we're using handlebars
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')

// serve static assets from the public/ folder
app.use(express.static('public'))

const seedDb = async () => {
  await db.sync({ force: true })

  const sauces = [
    { name: 'Sriracha', image: '/img/Sriracha.gif' },
    { name: 'Franks', image: '/img/Franks.gif' },
    { name: 'Tobasco', image: '/img/Tobasco.gif' }
  ]

  const restaurants = [
    { name: 'Applebees', location: 'Boston' },
    { name: 'Unos', location: 'Chicago' },
    { name: 'Via', location: 'New York' }
  ]

  const saucePromises = sauces.map((sauce) => Sauce.create(sauce))
  await Promise.all(saucePromises)
  const restPromises = restaurants.map((rest) => Restaurant.create(rest))
  await Promise.all(restPromises)
  console.log('db populated!')
}

seedDb()

app.get('/sauces', async (req, res) => {
  const sauces = await Sauce.findAll()
  res.render('sauces', { sauces }) //2 arguments: string name of the template, data to enter
  // console.log('normal', sauces)
  // console.log('destructured', { sauces })
})

app.get('/sauces/:id', async (req, res) => {
  const sauce = await Sauce.findByPk(req.params.id)
  res.render('sauce', { sauce })

  // console.log('DESTRUCTURE', { sauce })
  // console.log('NORMAL', sauce)
})

app.get('/restaurants', async (req, res) => {
  const restaurants = await Restaurant.findAll()
  // console.log(restaurants)
  res.render('restaurants', { restaurants })
})

app.get('/restaurants/:id', async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id)
  console.log(restaurant.name)
  res.render('restaurant', { restaurant })
})

// The two below have a similar function but do it in different ways.
app.get('/restaurant/sauces/:resId/:sauceId', async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.resId)
  const sauce = await Sauce.findByPk(req.params.sauceId)
  await restaurant.addSauce(sauce)
  const sauces = await Restaurant.findByPk(req.params.resId, {
    include: {
      model: Sauce
    }
  })
  res.render('res_sauce', { sauces })
})

// app.get('/restaurant/sauces/:resId/:sauceId', async (req, res) => {
//   const restaurant = await Restaurant.findByPk(req.params.resId)
//   const sauce = await Sauce.findByPk(req.params.sauceId)
//   await restaurant.addSauce(sauce)
//   const sauces = await restaurant.getSauces()
//   res.render('res_sauce', { sauces })
// })

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
