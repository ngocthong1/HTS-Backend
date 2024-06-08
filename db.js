import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

export default new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	protocol: 'postgres',
	// For SSL connections
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	}
})
