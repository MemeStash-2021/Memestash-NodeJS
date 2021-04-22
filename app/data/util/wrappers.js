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

exports.userCards = (id, data, empty=false) => {
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

exports.fullUser = (data)=> {
	return {
		id: data[0].user_id,
		name: data[0].username,
		wallet: data[0].wallet,
		cards: data.map(card => {
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