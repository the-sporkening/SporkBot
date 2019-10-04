const { db } = require('../client/Database');
const Sequelize = require('sequelize');

const Module = db.define('modules', {
	guildID: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
	},
	Modules: {
		type: Sequelize.JSONB,
		allowNull: false,
		default: {},
	},
});

module.exports = Module;