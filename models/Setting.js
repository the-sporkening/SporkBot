'use strict';
module.exports = (sequelize, DataTypes) => {
	const Setting = sequelize.define('Setting', {
		server_id: DataTypes.STRING,
		settings: DataTypes.JSONB,
	}, {});
	/*	Setting.associate = function(models) {
		// associations can be defined here
	};*/
	return Setting;
};
