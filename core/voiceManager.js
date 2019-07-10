// Main Requires
require('dotenv').config();
const log = require('../util/logger');
const levels = require('../util/levels');
// eslint-disable-next-line no-unused-vars
const bot = require('../bot');
const User = require('../models').User;
const VoiceXP = require('../models').VoiceXP;

module.exports = class VoiceManager {
	async handleChannelJoin(member, newChannel) {
		if (newChannel !== undefined) {
		// Add Xp for being in a voice channel
			const join = new Date().getTime();
			// joined.add(member.user.id, join);
			VoiceXP.findOrCreate({
				where: {
					snowflake: member.id,
					joined: join,
				},
			}).catch(err => log.error(err));
		}
	};
	async handleChannelLeave(member) {
		let startDate;
		try {
			// User leaves a voice channel
			VoiceXP.findOne({
				where: {
					snowflake: member.id,
				},
			}).spread(voicexp => {
				return startDate = voicexp.get('joined');
			// log.warn('local: ' + startDate);
			});
		}
		catch (err) {
			log.error(err);
		}
		log.warn('global: ' + startDate);
		const endDate = new Date();
		// log.warn(endDate.getTime());
		const seconds = Math.round((endDate.getTime() - startDate) / 1000);
		const minutes = seconds / 60;
		const percentMin = Math.round(minutes / 0.85);
		const xp = levels.genXp((minutes - percentMin), minutes);
		const xpToAdd = Math.round(xp * 1.13);
		User.findOrCreate({
			where: {
				user_id: member.id,
				server_id: member.id,
			},
			defaults: {
				xp: xpToAdd,
			},
		}).spread((user, created) => {
			if(!created) {
				return user.increment('xp', { by: xpToAdd })
					.then(() => {
					// remove user from db
						VoiceXP.destroy({
							where: {
								snowflake: member.id,
							}
						});
					});
			}
		}).catch(err => log.error(err));
	}
	// const handleChannelSwitch = function() {

	// };
	// const handleVoiceUpdate = function() {

// };
};
// module.exports = {
// 	handleChannelJoin: handleChannelJoin,
// 	handleChannelLeave: handleChannelLeave,
// 	// handleChannelSwitch: handleChannelSwitch,
// 	// handleVoiceUpdate: handleVoiceUpdate,
// };