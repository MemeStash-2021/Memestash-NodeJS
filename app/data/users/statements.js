module.exports = {
    getUsers: 'SELECT * FROM memestash.users;',
    getUsersFiltered: 'SELECT * FROM memestash.users where username LIKE ?;',
    addUser: 'INSERT INTO memestash.users(username, email, password, wallet) Values (?,?,?,wallet)',
    getUser: `SELECT users.*, cards.* FROM memestash.users u
                JOIN memestash.collections co ON u.id = co.user_id
                JOIN memestash.cards ca ON co.card_id = ca.id
                WHERE user_id = ?;`
}
