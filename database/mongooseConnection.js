var mongoose = require('mongoose');

//connectie opzetten

mongoose.connect(`mongodb://${process.env.MONGO_DB}/Authenticate`).catch((err) => {
    if (err) console.log('mongo failure:', err);
});
