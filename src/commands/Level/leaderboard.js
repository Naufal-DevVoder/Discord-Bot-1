// Dependencies
const { MessageEmbed } = require('discord.js');
const { Ranks } = require('../../modules/database/models/index');

// Show the ordinal for the ranks
// eslint-disable-next-line no-sparse-arrays
const ordinal = (num) => `${num.toLocaleString('en-US')}${[, 'st', 'nd', 'rd'][(num / 10) % 10 ^ 1 && num % 10] || 'th'}`;

module.exports.run = async (bot, message, args, settings) => {
	// Make sure the level plugin is enabled
	if (settings.LevelPlugin == false) return;

	// Retrieve Ranks from database
	Ranks.find({
		guildID: message.guild.id,
	}).sort([
		['Xp', 'descending'],
	]).exec((err, res) => {
		if (err) console.log(err);
		const embed = new MessageEmbed()
			.setTitle(message.translate(settings.Language, 'LEVEL/LEADERBOARD_TITLE'));
		if (res.length === 0) {
			// If there no results
			embed.addField(message.translate(settings.Language, 'LEVEL/LEADERBOARD_FIELDT'), message.translate(settings.Language, 'LEVEL/LEADERBOARD_FIELDDESC'));
		} else if (res.length < 10) {
			// If there are less than 10 results and then show this
			for (let i = 0; i < res.length; i++) {
				const name = message.guild.members.cache.get(res[i].userID) || 'User left';
				if (name == 'User left') {
					embed.addField(`${ordinal(i + 1)}. ${name}`, `**XP:** ${res[i].Xp}`);
				} else {
					embed.addField(`${ordinal(i + 1)}. ${name.user.username}`, `**XP:** ${res[i].Xp} | **Level:** ${res[i].Level}`);
				}
			}
		} else {
			// more than 10 results
			for (let i = 0; i < 10; i++) {
				const name = message.guild.members.cache.get(res[i].userID) || 'User left';
				if (name == 'User left') {
					embed.addField(`${i + 1}. ${name}`, `**XP:** ${res[i].Xp}`);
				} else {
					embed.addField(`${i + 1}. ${name.user.username}`, `**XP:** ${res[i].Xp}`);
				}
			}
		}
		message.channel.send(embed);
	});
};

module.exports.config = {
	command: 'leaderboard',
	aliases: ['lb', 'levels', 'ranks'],
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
};

module.exports.help = {
	name: 'Leaderboard',
	category: 'Level',
	description: 'Displays the Servers\'s level leaderboard.',
	usage: '${PREFIX}leaderboard',
};
