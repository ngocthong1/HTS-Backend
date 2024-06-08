import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

export const CartProduct = sequelize.define('cart_product', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})
