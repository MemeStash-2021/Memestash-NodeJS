module.exports = {
	getCards: "SELECT * FROM cards",
	getCardsByName: "SELECT * FROM cards WHERE name LIKE ?",
	getCardById: "SELECT * FROM cards where id = ?"
};
