const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler.middleware')
const connectDB = require('./config/db')

const bootcamps = require('./routes/bootcamps.routes')
const courses = require('./routes/courses.routes')
const auth = require('./routes/auth.routes')
const users = require('./routes/users.routes')
const reviews = require('./routes/reviews.routes')

// security
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

// load envs
const env = dotenv.config()
// if (env.error) {
//   throw env.error
// }

// connect to mongodb
connectDB()

const app = express()

// body parser
app.use(express.json())

// cookie parser
app.use(cookieParser())

// dev logging middlware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// file uploading
app.use(fileupload())

// sanitize data
app.use(mongoSanitize())

// set security headers
app.use(helmet({ contentSecurityPolicy: false }))

// prevent xxs (scripting been inserted into database then loaded into frontend and executing)
app.use(xss())

// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 25 // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})
app.use(limiter)

// prevent http param pollution
app.use(hpp())

// enable CORS
app.use(cors())

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)

  server.close(() => process.exit(1))
})
