import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    people_current: {
        type: Number,
        required: true
    },

    people_max: {
        type: Number,
        required: true
    },

    people_growth: {
        type: Number,
        required: true
    },

    prosperity_current: {
        type: Number,
        required: true
    },

    prosperity_max: {
        type: Number,
        required: true
    },

    prosperity_growth: {
        type: Number,
        required: true
    },

    crime_rate_current: {
        type: Number,
        required: true
    },

    crime_rate_max: {
        type: Number,
        required: true
    },

    money_current: {
        type: Number,
        required: true
    },

    money_max: {
        type: Number,
        required: true
    },

    money_growth: {
        type: Number,
        required: true
    },

    upgrades: {
        type: Array,
        required: true
    },

    crime_case_correct: {
        type: Number,
        required: true
    },

    crime_case_taken: {
        type: Array,
        required: true
    },

    crime_case: {
        type: Array,
        required: true
    },
});

const User = mongoose.model('Users', user_schema);
export default User;