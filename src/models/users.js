var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");


var UserSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook']
    },
    methodID: {
        type: String

    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    username: {
        type: String
    },
    birthDate: {
        type: Date,
        //require: true
    },
    gender: {
        type: String,
        // require: true
    },
    biography: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    categories: {
        type: [String]
    },
    subCategories: {
        type: [String]
    },
    totalExchanges: {
        type: Number
    },
    exchangesCanceled: {
        type: Number
    },
    exchangesCanceledByOthers: {
        type: Number
    },
    exchangeList: {
        type: [{ type: Schema.ObjectId, ref: 'Exchange' }]
    },
    garmentList: {
        type: [{ type: Schema.ObjectId, ref: 'Garment' }]
    },
    magazineList: {
        type: [{ type: Schema.ObjectId, ref: 'Magazine' }]
    },

    profilePhoto: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    isAdmin: Boolean
}, { timestamps: true }
);



UserSchema.statics.checkValidCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login 2')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login 2')
    }

    return user
}

UserSchema.methods.checkPassword = async function (currentPassword) {
    const user = this
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
        return false

    }

    return true
}


// add preferences 
UserSchema.methods.addPreferences = async function (req) {
    const user = this
    user.biography = req.body.bio
    user.categories = req.body.categories
    user.subCategories = req.body.subCategories
    user.profilePhoto = req.body.profilePhoto
    console.log(req.body.profilePhoto)
    await user.save()
}

UserSchema.methods.addGarment = async function (garment) {
    const user = this
    user.garmentList.push(garment)
    //console.log(user)
    console.log("\n\n\n\n\n\n\n\n")
    await user.save()
}

UserSchema.methods.addExchange = async function (exchange) {
    const user = this
    user.exchangeList.push(exchange)
    await user.save()
    console.log("save")
}

//custom method to generate authToken 
UserSchema.methods.newAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, 'thisismynewblog', { expiresIn: "7 days" })
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//hash the plain text password before saving
UserSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

UserSchema.pre('remove', async function (next) {
    const user = this
    await Post.deleteMany({ author: user._id })
    next()
})


var User = mongoose.model('User', UserSchema);


module.exports = User;