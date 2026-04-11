import mongoose from 'mongoose';

const codeSchema = new mongoose.Schema({
    userId: {
        type: String, // Storing Clerk ID directly makes querying easier
        required: true,
        index: true
    },
    query: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Code = mongoose.model('Code', codeSchema);
export default Code;
