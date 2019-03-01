'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			server_id: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			xp: {
				type: Sequelize.INTEGER,
				default: '0',
				allowNull: false,
			},
			coins: {
				type: Sequelize.INTEGER,
				default: '0',
				allowNull: false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('Users');
	},
};