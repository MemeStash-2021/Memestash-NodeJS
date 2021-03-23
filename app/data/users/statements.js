module.exports = {
    getUsers: 'SELECT * FROM users;',
    getUsersFiltered: 'SELECT * FROM users where username LIKE ?;',
    addUser: 'INSERT INTO users(username, email, password, wallet) Values (?,?,?,wallet)',
    getUser: 'SELECT users.id as user_id ,users.*, cards.* FROM users JOIN collections ON users.id = collections.user_id JOIN cards ON collections.card_id = cards.id WHERE users.id = ?;'
}
