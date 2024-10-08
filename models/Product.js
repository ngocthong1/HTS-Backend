import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

export const Product = sequelize.define('product', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false },
	price: { type: DataTypes.INTEGER, allowNull: false },
	description: { type: DataTypes.STRING, allowNull: true },
	stock: { type: DataTypes.INTEGER, allowNull: true },
	sold: { type: DataTypes.INTEGER, allowNull: true },
	img: { type: DataTypes.STRING, allowNull: true }
})
