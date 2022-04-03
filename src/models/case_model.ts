import mongoose from "mongoose";

const case_schema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },

    crime: {
        type: String,
        required: true
    },

    conclusion: {
        type: String,
        required: true
    },

    identity: {
        type: Array,
        required: true
    },

    case_is_guilty: {
        type: Boolean,
        required: true
    },

    rank: {
        type: Number,
        required: true
    }
});

const Case = mongoose.model('Cases', case_schema);
export default Case;