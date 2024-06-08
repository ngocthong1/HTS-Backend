import models from './models/index.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const initData = async () => {
	try {
		// Kiểm tra xem model User đã có dữ liệu hay chưa
		const existingUser = await models.User.findOne({
			where: {
				email: process.env.ADMIN_EMAIL
			}
		})

		if (!existingUser) {
			const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 5)
			// Tạo dữ liệu khởi tạo cho các models
			await models.User.create({
				email: process.env.ADMIN_EMAIL,
				password: hashedPassword,
				role: 'ADMIN'
			})
			console.log('Init data inserted successfully!')
		} else {
			console.log('Init data already exists, skipping...')
		}
	} catch (error) {
		console.error('Error inserting init data:', error)
	}
}

export default initData
