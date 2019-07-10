require('dotenv').config();
module.exports = {
	'development': {
		'username': 'root',
		'password': '',
		'database': 'sporkbot',
		'host': 'localhost',
		'dialect': 'mysql',
	},
	'test': {
		'username': 'root',
		'password': null,
		'database': 'database_test',
		'host': '127.0.0.1',
		'dialect': 'mysql',
	},
	'production': {
		'username': process.env.DB_USER,
		'password': process.env.DB_PASS,
		'database': process.env.DB_TABLE,
		'host': process.env.DB_HOST,
		'protocol': 'postgres',
		'dialect': 'postgres',
	},
};
