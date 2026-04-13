import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: String, // format: YYYY-MM-DD
        required: true
    },
    count: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

// Ensure unique combination of user and date
activitySchema.index({ userId: 1, date: 1 }, { unique: true });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
