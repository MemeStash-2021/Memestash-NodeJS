"use strict";

exports.simpleUser = (data) => {
	delete data.password;
	delete data.email;
	delete data.wallet;
	return data;
};

exports.userCreated = (data, username) => {
	return {
		id: data.insertId,
		name: username
	};
};

exports.fullUser = (id, data, empty=false) => {
	return {
		userid: id,
		count: data.length,
		cards: (empty) 
			? []
			: data.map(card => {
				return {
					id: card.id,
					name: card.name,
					image: card.picture,
					description: card.description,
					cost: card.price,
					views: card.views,
					likes: card.likes
				};
			})
	};
};