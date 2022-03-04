const express = require('express')

const AppError = require('./utils/appError.js')
const globalErrorHandler = require('./controllers/errorController.js')

// Routes
const dataRouter = require('./routes/dataRouter.js')

const app = express()

//* Get data

app.get('/', (req, res, next) => {
  res.json({
    message: 'Hello World',
  })
})

app.use('/data', dataRouter)

//) 404 not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
