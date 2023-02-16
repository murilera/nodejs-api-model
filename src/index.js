const express = require('express')

const app = express()

app.use('/', (req, res) => {
  res.json({
    sucess: true,
    data: 'empty'
  })
})
const PORT = 5000

const server = app.listen(PORT, console.log(`Server running on port ${PORT}`))
