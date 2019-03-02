'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		user_id: DataTypes.STRING,
		server_id: DataTypes.STRING,
		xp: DataTypes.INTEGER,
		coins: DataTypes.INTEGER,
	}, {});
	User.associate = function(models) {
		// associations can be defined here
	};
	return User;
};