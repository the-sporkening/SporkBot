const calcLevel = function(xp, round) {
	let level = ((Math.floor(0.7 * Math.log((0.001 * xp / Math.E) + 1) / Math.log(1.06))) / 0.9);
	if(round) {
		return Math.floor(level);
	}
	else{
		return level;
	}
};
// Generate XP function
const genXp = function(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.getLevel = calcLevel;
exports.genXp = genXp;