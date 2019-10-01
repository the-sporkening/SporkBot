// Check if is Valid URL
const isURL = function(url) {
	const expression = '[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)';
	const regex = new RegExp(expression);
	if (url.match(regex)) {
		return true;
	}
	else {
		return false;
	}
};
// TODO Check what provider url belongs to and approve the playing of the link
module.exports = {
	isURL,
};