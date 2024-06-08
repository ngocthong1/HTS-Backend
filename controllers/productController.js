import * as uuid from 'uuid'
import { Product } from '../models/Product.js'
import { ProductInfo } from '../models/ProductInfo.js'
import { Rating } from '../models/Rating.js'
import path from 'path'
import { __dirname } from '../helpers/dirname.js'
import fs from 'fs'
import { BAD_REQUEST, OK } from '../utils/Statuses.js'

class ProductController {
	async create(req, res) {
		try {
			let { name, price, description, brandId, typeId, info } = req.body

			// Getting image from request using express-fileupload
			const { img } = req.files

			// Generating random name for image
			const fileName = uuid.v4() + '.jpg'

			// Saving image to static folder (move to -> ../static/images)
			img.mv(path.resolve(__dirname, '..', 'static', 'images', fileName))

			let product

			try {
				// Creating new product
				product = await Product.create({
					name,
					price,
					description,
					brandId,
					typeId,
					info,
					img: fileName // Saving image name to database, not the exact one
				})
			} catch (e) {
				// Delete image from static folder if error occured while creating product
				// to avoid duplicates
				fs.unlinkSync(
					path.resolve(__dirname, '..', 'static', 'images', fileName)
				)

				return res
					.status(BAD_REQUEST)
					.json({ message: 'Failed to create a new product', cause: e.message })
			}

			// Creating information objects for every product (if info was provided)
			if (info) {
				info = JSON.parse(info)

				// Creating new instance in db for every info object
				info.forEach(i =>
					ProductInfo.create({
						title: i.title,
						description: i.description,
						vehicleId: product.id
					})
				)
			}

			if (product) return res.status(OK).json(product)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to create a new product', cause: e.message })
		}
	}

	async getAll(req, res) {
		try {
			const { brandId, typeId, limit = 1, page = 1, sort = '' } = req.query

			// Calculating offset for pagination
			let offset = page * limit - limit

			let products

			// If brandId and typeId are provided, get products by brandId and typeId
			if (brandId && typeId) {
				// findAndCountAll used for pagination, returns -> {count: number, rows: [data]}
				products = await Product.findAndCountAll({
					where: { brandId, typeId },
					limit,
					offset,
					// sort parameter is used to sort products, sort -> price_DESC, name_ASC etc.
					order: sort ? [[sort.split('_')[0], sort.split('_')[1]]] : []
				})
			}

			// If only brandId is provided, get products by brandId
			if (brandId && !typeId) {
				products = await Product.findAndCountAll({
					where: { brandId },
					limit,
					offset,
					order: sort ? [[sort.split('_')[0], sort.split('_')[1]]] : []
				})
			}

			// If only typeId is provided, get products by typeId
			if (!brandId && typeId) {
				products = await Product.findAndCountAll({
					where: { typeId },
					limit,
					offset,
					order: sort ? [[sort.split('_')[0], sort.split('_')[1]]] : []
				})
			}

			// If neither brandId nor typeId are provided, get all products
			if (!brandId && !typeId) {
				products = await Product.findAndCountAll({
					limit,
					offset,
					order: sort ? [[sort.split('_')[0], sort.split('_')[1]]] : []
				})
			}

			return res.status(OK).json(products)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to get products', cause: e.message })
		}
	}

	async getOne(req, res) {
		try {
			const { id } = req.params

			const product = await Product.findOne({
				where: { id },
				// including info objects for product (if any) to get them in response
				include: [{ model: ProductInfo, as: 'info' }]
			})

			return res.status(OK).json(product)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to get product by id', cause: e.message })
		}
	}

	async getThreeMostPopular(_, res) {
		try {
			const products = await Product.findAll()

			// Sorting products by rating
			let vehiclesRatings = new Map()

			for (let i = 0; i < products.length; i++) {
				let vehicleId = products[i].id

				// Get all ratings from product
				let ratings = await Rating.findAll({ where: { vehicleId } })

				// If product currently has no rates -> set default rate value to 0
				if (ratings.length === 0) {
					ratings = [{ rate: 0 }]
				}

				// Calculate average rating
				const averageRating = Math.round(
					ratings.reduce((acc, rating) => acc + rating.rate, 0) / ratings.length
				)

				vehiclesRatings.set(vehicleId, averageRating)
			}

			// Get 3 most popular products from vehiclesRatings map where key
			// is vehicleId and value is average rating
			const mostPopularVehicles = [...vehiclesRatings.entries()]
				.sort((a, b) => b[1] - a[1])
				.slice(0, 3)

			// Get products by id
			const popularVehiclesById = await Product.findAll({
				where: {
					id: mostPopularVehicles.map(v => v[0])
				}
			})

			return res.status(OK).json(popularVehiclesById)
		} catch (e) {
			return res.status(BAD_REQUEST).json({
				message: 'Failed to get three most popular products',
				cause: e.message
			})
		}
	}

	async deleteVehicle(req, res) {
		try {
			const { vehicleId } = req.body

			// Deleting product by id
			await Product.destroy({ where: { vehicleId } })

			return res.status(OK).json({ message: 'Product deleted successfully' })
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to delete product', cause: e.message })
		}
	}
}

export default new ProductController()
