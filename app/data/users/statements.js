module.exports = {
    getUsers: 'SELECT * FROM memestash.users;',
    getUsersFiltered: 'SELECT * FROM memestash.users where username LIKE ?;'
}