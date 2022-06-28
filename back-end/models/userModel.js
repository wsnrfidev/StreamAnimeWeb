import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        createdAt: {type: Date},
        mediaAdded: [{
            addedAt: {type: Date},
            id: {type: Number | String},
            primaryColor: {type: String},
            fullTitle: {type: String},
            nativeTitle: {type: String},
            coverImg: {type: String},
            bannerImg: {type: String},
            format: {type: String},
            type: {type: String},
            status: {type: String},
            isAdult: {type: Boolean},
            fromGoGoAnime: {type: Boolean, default: false}

        }]

    }

)

const User = mongoose.model('User', userSchema)

export default User;