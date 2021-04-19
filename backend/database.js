const bcrypt = require('bcrypt')

let users = {
    users: [
        { id: 1, username: 'Pung', password: '$2b$10$0AsMSQaUB0AlLnKzgeUOfOE.hWUodtuR4NOU954XLVy2gy3lBWsdO', email: 'patiparn@gmail.com' , classuser: 0 },
        { id: 2, username: 'Aum', password: '$2b$10$1Bu4tImM/Ms9rtU.8/n/COWpzUAGFB6YlsO5xZqFih1JUxafyFFXa', email: 'Aunaum@gmail.com'  ,classuser: 0},
        { id: 3, username: 'un_user', password: '$2b$10$CCJEfK6HJg5cX7Ow.IRKuOihh.zvwSfBm8ojMtY1xVEqLCNgSj5Yi', email: 'NaN'  ,classuser: 2},
    ]
}
/*classuser: 0 Admin
  classuser: 1 user
  classuser: 2 un_user (not login)
*/
const SECRET = 'your_jwt_secret'
const NOT_FOUND = -1

exports.users = users 
exports.SECRET = SECRET
exports.NOT_FOUND = NOT_FOUND

exports.setUsers = function(_users) { 
  users = _users;
}

// === validate username/password ===
exports.isValidUser = async (username, password) => { 
    const index = users.users.findIndex(item => item.username === username) 
    return await bcrypt.compare(password, users.users[index].password)
}

// return -1 if user is not existing
exports.checkExistingUser = (username) => {
    return users.users.findIndex(item => item.username === username)
}