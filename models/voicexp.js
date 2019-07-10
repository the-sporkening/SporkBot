'use strict';
module.exports = (sequelize, DataTypes) => {
	const VoiceXP = sequelize.define('VoiceXP', {
		snowflake: DataTypes.STRING,
		joined: DataTypes.STRING,
	}, {});
	VoiceXP.associate = function(models) {
		// associations can be defined here
	};
	return VoiceXP;
};