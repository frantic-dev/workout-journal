require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())

const Workout = require('./models/workout')

const morgan = require('morgan')
morgan.token('req-body', function getReqBody(request) {
	return JSON.stringify(request.body)
})
const requestLogger = morgan(
	':method :url :status :res[content-length] - :response-time ms :req-body'
)

app.use(requestLogger)

app.get('/', (req, res) => {
	res.send('<h3>Hello world </h3>')
})

app.get('/api/workouts', (request, response, next) => {
	Workout.find({}).then((workouts) => response.json(workouts))
})

app.get('/api/workouts', (request, response, next) => {})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`server running on ${PORT} port`)
})

// const youtubeThumbnail = require('youtube-thumbnail')

// const thumbnail = youtubeThumbnail(
// 	'https://www.youtube.com/watch?v=8qlSDwbdFk4'
// )

// console.log(thumbnail)

// const getYoutubeTitle = require('get-youtube-title')

// function getYbId(url) {
// 	let idIndex = url.indexOf('v=')
// 	console.log(idIndex)
// 	console.log(url.slice(idIndex + 2))
// 	return url.slice(idIndex + 2)
// }

// const url = 'https://www.youtube.com/watch?v=o6iVoV_9pks'

// getYoutubeTitle(
// 	getYbId(url),
// 	'AIzaSyBGk9pbtLDOlEoXdrImVHI7wDNQE7sWZrw',
// 	(err, title) => {
// 		console.log(title)
// 	}
// )
