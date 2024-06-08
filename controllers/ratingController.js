import { Rating } from '../models/Rating.js'
import { OK, BAD_REQUEST } from '../utils/Statuses.js'

class RatingController {
	async setRating(req, res) {
		try {
			const { productId, userId, rate } = req.body

			// Check if user has already rated this product
			const ratingExists = await Rating.findOne({
				where: { productId, userId }
			})

			if (ratingExists) {
				// Update exsisting rating
				await ratingExists.update({ rate: Number(rate) })
				return res.status(OK).json(ratingExists)
			}

			// Set rating
			const newRating = await Rating.create({
				productId,
				userId,
				rate: Number(rate)
			})

			return res.status(OK).json(newRating)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to set rating', cause: e.message })
		}
	}

	async calculateAverageRating(req, res) {
		try {
			const { productId } = req.query

			// Get all ratings from product
			const ratings = await Rating.findAll({ where: { productId } })

			if (!ratings) {
				return res
					.status(BAD_REQUEST)
					.json({ message: 'Ratings not found', cause: null })
			}

			// Calculate average rating
			const averageRating = Math.round(
				ratings.reduce((acc, rating) => acc + rating.rate, 0) / ratings.length
			)

			return res.status(OK).json(averageRating)
		} catch (e) {
			return res.status(BAD_REQUEST).json({
				message: 'Failed to calculate average rating',
				cause: e.message
			})
		}
	}

	async getUserRating(req, res) {
		try {
			const { userId } = req.params
			const { productId } = req.query

			// Get user rating
			const rating = await Rating.findOne({ where: { productId, userId } })

			if (!rating) {
				return res
					.status(BAD_REQUEST)
					.json({ message: 'Rating not found', cause: null })
			}

			return res.status(OK).json(rating)
		} catch (e) {
			return res.status(BAD_REQUEST).json({
				message: 'Failed to get user rating',
				cause: e.message
			})
		}
	}
}

export default new RatingController()
