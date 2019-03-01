'use strict';
module.exports = (sequelize, DataTypes) => {
	const Settings = sequelize.define('Setting', {
		server_id: DataTypes.STRING,
		setting_name: DataTypes.STRING,
		setting_value: DataTypes.STRING,
	}, {});
	/*	Settings.associate = function(models) {
		// associations can be defined here
	};*/
	return Settings;
};