'use strict';
const levels = require('../util/levels');
module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert('Users', [{
			user_id: levels.genXp(113086797872918528, 147137133897973760),
			server_id: '535881918483398676',
			xp: levels.genXp(2342, 45355),
			coins: 0,
			createdAt: '2019-03-09 14:59:09.216-08',
			updatedAt: '2019-03-09 14:59:09.216-08',
		}], {});
	},

	down: () => {
		//
	},
};
