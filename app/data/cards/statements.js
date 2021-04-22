module.exports = {
	getCards: "SELECT * FROM cards",
	getCardsByName: "SELECT * FROM cards WHERE name LIKE ?",
	getCardById: "SELECT * FROM cards where id = ?",
	getUserCards: "SELECT cards.* FROM users JOIN collections ON users.id = collections.user_id JOIN cards ON collections.card_id = cards.id WHERE users.id = ?;"
};
