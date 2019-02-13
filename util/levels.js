const calcLevel = function(xp, round){
    const diff = 75;
    let level = (Math.floor(20 + Math.sqrt(425 + 100 * xp)) / diff) / 2;
    if(round){
        return Math.floor(level);
    }else{
        return level;
    }
};
// Generate XP function
const genXp = function () {
    return Math.floor(Math.random() * 15) + 1
};
exports.getLevel = calcLevel;
exports.genXp = genXp;