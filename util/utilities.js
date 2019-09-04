const axios = require('axios');
const handleStats = (plat, user) => {
    const player = searchForPlayer(plat, user);
    let playerid = player;
    console.log(playerid);
    const baseUrl = 'https://r6tab.com/api/player.php?p_id=';
    axios.get(baseUrl + playerid, {
		params: {
			platform: plat,
			search: user,
		},
	})
		.then(function(response) {
			return response;
		})
		.catch(function(error) {
			console.log(error);
		});
    // Search for player to get id
    // store the id
    // use the id to retrieve the stats

}
const searchForPlayer = (plat, user) => {
    let data;
	const baseUrl = 'https://r6tab.com/api/';
	// let fullUrl = baseUrl + 'platform=' + platform + '&search=' + user;
	axios.get(baseUrl + 'search.php', {
		params: {
			platform: plat,
			search: user,
		},
	})
		.then(function(response) {
			data = response;
		})
		.catch(function(error) {
			console.log(error);
        });
        console.log(data);

};
module.exports = { searchForPlayer };