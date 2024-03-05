const users = require('./data')
const oldestUser = users.reduce((oldest, current) => {
    return (current.age > oldest.age) ? current : oldest;
}, users[0]);

  
module.exports = oldestUser ;