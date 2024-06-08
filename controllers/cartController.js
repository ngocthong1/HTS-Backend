import { OK, BAD_REQUEST } from '../utils/Statuses.js'
import { Cart } from '../models/Cart.js'
import { CartProduct } from '../models/CartProduct.js'
import { Product } from '../models/Product.js'

class CartController {
	async addToCart(req, res) {
		try {
			const { productId, userId } = req.body

			// Find user's cart
			let cart = await Cart.findOne({ where: { userId } })

			if (!cart) {
				return res
					.status(BAD_REQUEST)
					.json({ message: 'Cart not found', cause: null })
			}

			const cartId = cart.id

			// Add product to cart
			const CartProduct = await CartProduct.create({ cartId, productId })

			return res.status(OK).json(CartProduct)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to add to cart', cause: e.message })
		}
	}

	async removeFromCart(req, res) {
		try {
			const { productId, userId } = req.body

			// Get user's cart
			const cart = await Cart.findOne({ where: { userId } })

			if (!cart) {
				return res
					.status(BAD_REQUEST)
					.json({ message: 'Cart not found', cause: null })
			}

			const cartId = cart.id

			// Remove product from cart
			await CartProduct.destroy({ where: { cartId, productId } })

			return res.status(OK).json('Product removed from cart')
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to remove from cart', cause: e.message })
		}
	}

	async getAll(req, res) {
		try {
			const { userId } = req.query

			// Get user's cart
			const cart = await Cart.findOne({ where: { userId } })

			if (!cart) {
				return res
					.status(BAD_REQUEST)
					.json({ message: 'Cart not found', cause: null })
			}

			const cartId = cart.id

			// Get all products from found cart
			const CartProducts = await CartProduct.findAll({ where: { cartId } })

			let products = []

			for (let i = 0; i < CartProducts.length; i++) {
				const product = await Product.findAll({
					where: { id: CartProducts[i].productId }
				})
				products.push(product[0])
			}

			return res.status(OK).json(products)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to get elements from cart', cause: e.message })
		}
	}

	async isInCart(req, res) {
		try {
			const { productId, userId } = req.query

			// Get user's cart
			const cart = await Cart.findOne({ where: { userId } })

			if (!cart) {
				return res
					.status(BAD_REQUEST)
					.json({ message: 'Cart not found', cause: null })
			}

			const cartId = cart.id

			// Check if product is in the cart
			const CartProduct = await CartProduct.findOne({
				where: { cartId, productId }
			})

			if (!CartProduct) {
				return res.status(OK).json(false)
			}

			return res.status(OK).json(true)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to get elements from cart', cause: e.message })
		}
	}

	async calculateTotalPrice(req, res) {
		try {
			const { userId } = req.query

			// Get user's cart
			const cart = await Cart.findOne({ where: { userId } })

			if (!cart) {
				return res
					.status(BAD_REQUEST)
					.json({ message: 'Cart not found', cause: null })
			}

			const cartId = cart.id

			// Get all products from found cart
			const CartProducts = await CartProduct.findAll({ where: { cartId } })

			let totalPrice = 0

			for (let i = 0; i < CartProducts.length; i++) {
				const product = await Product.findAll({
					where: { id: CartProducts[i].productId }
				})
				totalPrice += product[0].price
			}

			return res.status(OK).json(totalPrice)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to get elements from cart', cause: e.message })
		}
	}
}

export default new CartController()
