import { Brand } from './Brand.js'
import { Product } from './Product.js'
import { Type } from './Type.js'
import { User } from './User.js'
import { Cart } from './Cart.js'
import { CartProduct } from './CartProduct.js'
import { Rating } from './Rating.js'
import { ProductInfo } from './ProductInfo.js'
import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

// Description of relationships between entities

User.hasOne(Cart)
Cart.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Cart.hasMany(CartProduct)
CartProduct.belongsTo(Cart)

Type.hasMany(Product)
Product.belongsTo(Type)

Brand.hasMany(Product)
Product.belongsTo(Brand)

Product.hasMany(Rating)
Rating.belongsTo(Product)

Product.hasMany(CartProduct)
CartProduct.belongsTo(Product)

Product.hasMany(ProductInfo, { as: 'info' })
ProductInfo.belongsTo(Product)

// Helper table for many-to-many relationship between Brand and Type

export const TypeBrand = sequelize.define('type_brand', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

Type.belongsToMany(Brand, { through: TypeBrand })
Brand.belongsToMany(Type, { through: TypeBrand })

export default {
	Brand,
	Product,
	Type,
	User,
	Cart,
	CartProduct,
	Rating,
	ProductInfo,
	TypeBrand
}
