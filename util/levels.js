const calcLevel = function(xp, round){
    if(round){
        const diff = 100;
        let level = Math.floor(45 + Math.sqrt(625 + 100 * xp)) / diff;
        let roundl = Math.floor(level);
        return roundl;
    }else{
        const diff = 100;
        let level = Math.floor(45 + Math.sqrt(625 + 100 * xp)) / diff;
        return level;
    }
};
// Generate XP function
const genXp = function () {
    return Math.floor(Math.random() * 6) + 1
};

exports.level = [calcLevel, genXp];