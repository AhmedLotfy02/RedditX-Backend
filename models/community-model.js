const mongoose = require("mongoose");

const communityRuleSchema = mongoose.Schema({
  title: String,
  description: String,
});

const FAQSchema = mongoose.Schema({
  question: String,
  answer: String,
});

const flairSchema = mongoose.Schema({
  flairID: String,
  flairText: String,
  flairTextColor: String,
  flairBackGround: String,
  flairModOnly: {
    type: Boolean,
    default: 0,
  },
  flairAllowUserEdits: {
    type: Boolean,
    default: 0,
  },
});

const communityOptionsSchema = mongoose.Schema({
  emailUsernameMention: {
    type: Boolean,
    default: 1,
  },
  nsfw: {
    type: Boolean,
    default: 0,
  },
  welcomeMessage: String,
  allowImgAndLinksUploads: {
    type: Boolean,
    default: 1,
  },
  allowMultipleImagePerPost: {
    type: Boolean,
    default: 1,
  },
  suggestedCommentSort: String,
  postType: Number, // 0 any, 1 videos and images only, and 2 text only
  region: String,
  privacyType: String, // "public" (anyone can view and submit), "private" (only approved members can view and submit), or "restricted" (anyone can view, but only some are approved to submit links)
  spamsNumBeforeRemove: Number,
});

const memberSchema = mongoose.Schema({
  userID: String,
  isMuted: {
    type: Boolean,
    default: 0,
  },
  isBanned: {
    type: Boolean,
    default: 0,
  },
});

const moderatorSchema = mongoose.Schema({
  userID: String,
  role: String,
});

const communitySchema = mongoose.Schema({
  communityID: {
    type: String,
    required: [true, "A community must have an id!"],
    unique: [true, "A community must have an unique id!"],
  },
  communityRules: [
    {
      type: communityRuleSchema,
    },
  ],
  description: {
    type: String,
    required: [true, "A community must have a description!"],
    trim: true, // Remove all the white space in the beginning or end of the field
    maxLength: [
      100000,
      "A community description must have less than or equal to 100000 characters",
    ],
    minLength: [
      1,
      "A community description must have more than or equal to 1 character",
    ],
  },
  banner: String,
  icon: String,
  membersCnt: {
    type: Number,
    default: 1,
  },
  FAQs: [
    {
      type: FAQSchema,
    },
  ],
  isDeleted: {
    type: Boolean,
    default: 0,
  },
  createdAt: String,
  rank: Number,
  trendPoints: Number,
  flairList: [
    {
      type: flairSchema,
    },
  ],
  communityOptions: communityOptionsSchema,
  members: [
    {
      type: memberSchema,
    },
  ],
  moderators: [
    {
      type: moderatorSchema,
    },
  ],
  category: String,
  categories: [String],
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;