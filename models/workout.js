const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log('connecting to ', url)

mongoose
	.connect(url)
	.then((result) => console.log('connected to MongoDB'))
	.catch((error) => console.log('error connecting to MongoDB: ', error.message))

const workoutSchema = new mongoose.Schema({
	url: String,
	title: String,
	thumbnail: String,
	intensity: Number,
	variety: Number,
	fatigue: Number,
	enjoyment: Number,
})

workoutSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Workout', workoutSchema)
