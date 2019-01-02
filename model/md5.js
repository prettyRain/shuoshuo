/**
 * Created by prettyRain on 2018/12/10.
 */

var crypto = require('crypto');

module.exports = function(password){
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}
