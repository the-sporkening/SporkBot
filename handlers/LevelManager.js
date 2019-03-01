'use strict';

module.exports = class LevelManager {
	async calcLevel(xp, round) {
		const diff = 75;
		const level = (Math.floor(20 + Math.sqrt(425 + 100 * xp)) / diff) / 2;
		if(round) {
			return Math.floor(level);
		}
		else{
			return level;
		}
	}
	// Generate XP function
	async genXp(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
};