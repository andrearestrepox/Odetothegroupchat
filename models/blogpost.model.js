const { Schema, model, trusted } = require("mongoose");

const blogpostSchema = new Schema(
    {
        title: {
            type: String,
            required: trusted
        },
        content: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String
        },
        
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    {
        timestamps: true
    }
);

const BlogPost = model("BlogPost", blogpostSchema)
module.exports = BlogPost