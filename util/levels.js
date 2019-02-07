const calcLevel = function(xp, round){
    const diff = 75;
    if(round){
        let level = Math.floor(45 + Math.sqrt(625 + 100 * xp)) / diff;
        let roundl = Math.floor(level);
        return roundl;
    }else{
        let level = Math.floor(45 + Math.sqrt(625 + 100 * xp)) / diff;
        return level;
    }
};
// Generate XP function
const genXp = function () {
    return Math.floor(Math.random() * 15) + 1
};

exports.level = calcLevel;
exports.genXp = genXp;