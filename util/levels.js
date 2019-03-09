const calcLevel = function(xp, round) {
	const diff = 50;
	const level = (Math.floor(20 + Math.sqrt(425 + 100 * xp)) / diff) / 2;
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