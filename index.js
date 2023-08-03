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

const getYoutubeTitle = require('get-youtube-title')

app.get('/api/workouts', (request, response, next) => {
	Workout.find({})
		.then((workouts) => response.json(workouts))
		.catch((error) => next(error))
})

app.get('/api/title/:id', (request, response, next) => {
	const id = request.params.id
	getYoutubeTitle(id, process.env.API_KEY, (err, title) => {
		response.send(title)
	})
})

app.post('/api/workouts', (request, response, next) => {
	const body = request.body
	const workout = new Workout({
		url: body.url,
		title: body.title,
		thumbnail: body.thumbnail,
		intensity: body.intensity,
		variety: body.variety,
		enjoyment: body.enjoyment,
		fatigue: body.fatigue,
	})

	workout
		.save()
		.then((savedWorkout) => response.json(savedWorkout))
		.catch((error) => next(error))
})

app.delete('/api/workouts/:id', (request, response, next) => {
	Workout.findByIdAndDelete(request.params.id)
		.then((result) => response.status(404).end())
		.catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.log(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'mal formated id' })
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`server running on ${PORT} port`)
})
