module.exports = {
	addUser: "INSERT INTO memestash.users(username, email, password, wallet) VALUES (?,?,?,0);",
	getCards: "SELECT * FROM cards",
	getCardsByName: "SELECT * FROM cards WHERE name LIKE ?",
	getCardById: "SELECT * FROM cards where id = ?",
	getUserCards: "SELECT cards.* FROM users JOIN collections ON users.id = collections.user_id JOIN cards ON collections.card_id = cards.id WHERE users.id = ?;",
	getUsers: "SELECT * FROM users;",
	getUsersFiltered: "SELECT * FROM users where username LIKE ?;",
	getUser: "SELECT users.id as user_id ,users.*, cards.* FROM users JOIN collections ON users.id = collections.user_id JOIN cards ON collections.card_id = cards.id WHERE users.id = ?;",
};