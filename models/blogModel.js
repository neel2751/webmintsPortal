import { Schema, models, model } from "./mongoose";

const headlineSchema = new Schema({
  text: { type: String, required: true },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isWinner: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

const blogPostSchema = new Schema(
  {
    // The websites this post is published to — one post can appear on
    // several sites, but the public API only serves it to sites in this list.
    websiteIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Website" }],
      required: true,
      index: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one website is required",
      },
    },
    headlines: [headlineSchema],
    // title: { type: String, required: true },
    description: { type: String }, // optional detailed description
    // Image we have to add here
    coverImage: {
      url: { type: String, required: true }, // URL to cover image
      mediaId: { type: Schema.Types.ObjectId, ref: "Media" }, // reference to Media model
      key: { type: String }, // S3 key or similar identifier for storage
      fileName: { type: String }, // original file name
      fileType: { type: String }, // MIME type of the file
    },
    slug: { type: String, required: true }, // critical for SEO — unique per website (compound index below)
    contentJson: { type: Object, required: true }, // rich text content stored as an object // Store as JSON from NovelAI/ Tiptap
    contentHtml: { type: String, required: true }, // HTML content for rendering
    summary: { type: String, required: true }, // brief summary for previews
    category: { type: String, required: true }, // e.g., Technology, Lifestyle
    tags: [{ type: String }], // array of tags for better searchability
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
      canonicalUrl: { type: String },
      ogImage: {
        url: { type: String }, // URL to Open Graph image
        mediaId: { type: Schema.Types.ObjectId, ref: "Media" }, // reference to Media model
        key: { type: String }, // S3 key or similar identifier for storage
        fileName: { type: String }, // original file name
        fileType: { type: String }, // MIME type of the file
      },
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    countViews: { type: Number, default: 0 }, // track number of views
    isFeatured: { type: Boolean, default: false }, // highlight featured posts
    isPinned: { type: Boolean, default: false }, // pin important posts to the top
    isActive: { type: Boolean, default: true }, // active/inactive flag
    isDeleted: { type: Boolean, default: false }, // soft delete flag
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

// Same slug may exist on different websites, never twice on the same one.
// (Multikey unique index: each websiteIds element + slug pair must be unique.)
blogPostSchema.index({ websiteIds: 1, slug: 1 }, { unique: true });

const BlogPostModel = models.BlogPost || model("BlogPost", blogPostSchema);
export default BlogPostModel;

BlogPostModel.schema = blogPostSchema;

// Add indexes for performance optimization
// blogPostSchema.index({ slug: 1 });
// blogPostSchema.index({ category: 1 });
// blogPostSchema.index({ tags: 1 });
// blogPostSchema.index({ status: 1 });
// blogPostSchema.index({ isFeatured: 1 });
// blogPostSchema.index({ isPinned: 1 });
// blogPostSchema.index({ isActive: 1 });
// blogPostSchema.index({ isDeleted: 1 });
// blogPostSchema.index({ "seo.keywords": 1 });
// blogPostSchema.index({ createdAt: -1 });
// blogPostSchema.index({ updatedAt: -1 });
// blogPostSchema.set("timestamps", true); // adds createdAt and updatedAt fields
// blogPostSchema.set("toJSON", { virtuals: true });
// blogPostSchema.set("toObject", { virtuals: true });
// blogPostSchema.virtual("excerpt").get(function () {
//   return this.content.slice(0, 200) + "..."; // first 200 characters as excerpt
// });
// blogPostSchema.virtual("readTime").get(function () {
//   const wordsPerMinute = 200; // average reading speed
//   const text =
//     typeof this.content === "string"
//       ? this.content
//       : JSON.stringify(this.content);
//   const wordCount = text.split(/\s+/).length;
//   return Math.ceil(wordCount / wordsPerMinute);
// });
// blogPostSchema.pre("save", function (next) {
//   // Ensure slug is lowercase and hyphenated
//   this.slug = this.slug
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
//   next();
// });
// blogPostSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.slug) {
//     update.slug = update.slug
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/^-+|-+$/g, "");
//   }
//   next();
// });
// blogPostSchema.post("save", function (doc) {
//   console.log(`Blog post titled "${doc.title}" has been saved.`);
// });
// blogPostSchema.post("findOneAndUpdate", function (doc) {
//   console.log(`Blog post titled "${doc.title}" has been updated.`);
// });
// blogPostSchema.post("findOneAndDelete", function (doc) {
//   console.log(`Blog post titled "${doc.title}" has been deleted.`);
// });
// blogPostSchema.methods.publish = function () {
//   this.status = "published";
//   return this.save();
// };
// blogPostSchema.methods.archive = function () {
//   this.status = "archived";
//   return this.save();
// };
// blogPostSchema.methods.softDelete = function () {
//   this.isDeleted = true;
//   return this.save();
// };
// blogPostSchema.methods.restore = function () {
//   this.isDeleted = false;
//   return this.save();
// };
// blogPostSchema.statics.findBySlug = function (slug) {
//   return this.findOne({ slug, isDeleted: false });
// };
// blogPostSchema.statics.findFeatured = function () {
//   return this.find({ isFeatured: true, isDeleted: false });
// };
// blogPostSchema.statics.findPinned = function () {
//   return this.find({ isPinned: true, isDeleted: false });
// };
// blogPostSchema.statics.searchByTag = function (tag) {
//   return this.find({ tags: tag, isDeleted: false });
// };
// blogPostSchema.statics.searchByCategory = function (category) {
//   return this.find({ category, isDeleted: false });
// };
// blogPostSchema.statics.getPublishedPosts = function () {
//   return this.find({ status: "published", isDeleted: false });
// };
// blogPostSchema.statics.getDraftPosts = function () {
//   return this.find({ status: "draft", isDeleted: false });
// };
// blogPostSchema.statics.getArchivedPosts = function () {
//   return this.find({ status: "archived", isDeleted: false });
// };
// blogPostSchema.statics.getActivePosts = function () {
//   return this.find({ isActive: true, isDeleted: false });
// };
// blogPostSchema.statics.getInactivePosts = function () {
//   return this.find({ isActive: false, isDeleted: false });
// };
// blogPostSchema.statics.getDeletedPosts = function () {
//   return this.find({ isDeleted: true });
// };
// blogPostSchema.statics.getAllPosts = function () {
//   return this.find({});
// };
// blogPostSchema.methods.toggleFeatured = function () {
//   this.isFeatured = !this.isFeatured;
//   return this.save();
// };
// blogPostSchema.methods.togglePinned = function () {
//   this.isPinned = !this.isPinned;
//   return this.save();
// };
// blogPostSchema.methods.toggleActive = function () {
//   this.isActive = !this.isActive;
//   return this.save();
// };
// blogPostSchema.methods.updateSEO = function (seoData) {
//   this.seo = { ...this.seo, ...seoData };
//   return this.save();
// };
// blogPostSchema.methods.updateContent = function (newContent) {
//   this.content = newContent;
//   return this.save();
// };
// blogPostSchema.methods.updateSummary = function (newSummary) {
//   this.summary = newSummary;
//   return this.save();
// };
// blogPostSchema.methods.updateCategory = function (newCategory) {
//   this.category = newCategory;
//   return this.save();
// };
// blogPostSchema.methods.addTag = function (tag) {
//   if (!this.tags.includes(tag)) {
//     this.tags.push(tag);
//   }
//   return this.save();
// };
// blogPostSchema.methods.removeTag = function (tag) {
//   this.tags = this.tags.filter((t) => t !== tag);
//   return this.save();
// };
// blogPostSchema.methods.updateTitle = function (newTitle) {
//   this.title = newTitle;
//   return this.save();
// };
// blogPostSchema.methods.updateSlug = function (newSlug) {
//   this.slug = newSlug;
//   return this.save();
// };
// blogPostSchema.methods.updateStatus = function (newStatus) {
//   if (["draft", "published", "archived"].includes(newStatus)) {
//     this.status = newStatus;
//   }
//   return this.save();
// };
// blogPostSchema.methods.updatePost = function (updateData) {
//   Object.keys(updateData).forEach((key) => {
//     this[key] = updateData[key];
//   });
//   return this.save();
// };
// blogPostSchema.statics.bulkPublish = function (ids) {
//   return this.updateMany(
//     { _id: { $in: ids }, isDeleted: false },
//     { status: "published" }
//   );
// };
// blogPostSchema.statics.bulkArchive = function (ids) {
//   return this.updateMany(
//     { _id: { $in: ids }, isDeleted: false },
//     { status: "archived" }
//   );
// };
// blogPostSchema.statics.bulkSoftDelete = function (ids) {
//   return this.updateMany({ _id: { $in: ids } }, { isDeleted: true });
// };
// blogPostSchema.statics.bulkRestore = function (ids) {
//   return this.updateMany({ _id: { $in: ids } }, { isDeleted: false });
// };
// blogPostSchema.statics.bulkToggleFeatured = async function (ids) {
//   const posts = await this.find({ _id: { $in: ids }, isDeleted: false });
//   const bulkOps = posts.map((post) => ({
//     updateOne: {
//       filter: { _id: post._id },
//       update: { isFeatured: !post.isFeatured },
//     },
//   }));
//   return this.bulkWrite(bulkOps);
// };
// blogPostSchema.statics.bulkTogglePinned = async function (ids) {
//   const posts = await this.find({ _id: { $in: ids }, isDeleted: false });
//   const bulkOps = posts.map((post) => ({
//     updateOne: {
//       filter: { _id: post._id },
//       update: { isPinned: !post.isPinned },
//     },
//   }));
//   return this.bulkWrite(bulkOps);
// };
// blogPostSchema.statics.bulkToggleActive = async function (ids) {
//   const posts = await this.find({ _id: { $in: ids }, isDeleted: false });
//   const bulkOps = posts.map((post) => ({
//     updateOne: {
//       filter: { _id: post._id },
//       update: { isActive: !post.isActive },
//     },
//   }));
//   return this.bulkWrite(bulkOps);
// };
// blogPostSchema.statics.countByStatus = function () {
//   return this.aggregate([
//     { $match: { isDeleted: false } },
//     {
//       $group: {
//         _id: "$status",
//         count: { $sum: 1 },
//       },
//     },
//   ]);
// };
// blogPostSchema.statics.countByCategory = function () {
//   return this.aggregate([
//     { $match: { isDeleted: false } },
//     {
//       $group: {
//         _id: "$category",
//         count: { $sum: 1 },
//       },
//     },
//   ]);
// };
// blogPostSchema.statics.countByTag = function () {
//   return this.aggregate([
//     { $match: { isDeleted: false } },
//     { $unwind: "$tags" },
//     {
//       $group: {
//         _id: "$tags",
//         count: { $sum: 1 },
//       },
//     },
//   ]);
// };
// blogPostSchema.statics.getRecentPosts = function (limit = 5) {
//   return this.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(limit);
// };
// blogPostSchema.statics.getPopularPosts = function (limit = 5) {
//   // Placeholder for popular posts logic, e.g., based on views or likes
//   return this.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(limit);
// };
// blogPostSchema.statics.getPostsByDateRange = function (startDate, endDate) {
//   return this.find({
//     createdAt: { $gte: startDate, $lte: endDate },
//     isDeleted: false,
//   });
// };
// blogPostSchema.statics.getPostsWithSEO = function () {
//   return this.find({
//     $or: [
//       { "seo.metaTitle": { $exists: true, $ne: "" } },
//       { "seo.metaDescription": { $exists: true, $ne: "" } },
//       { "seo.keywords": { $exists: true, $ne: [] } },
//     ],
//     isDeleted: false,
//   });
// };
// blogPostSchema.statics.getPostsWithoutSEO = function () {
//   return this.find({
//     $and: [
//       { "seo.metaTitle": { $in: [null, ""] } },
//       { "seo.metaDescription": { $in: [null, ""] } },
//       { "seo.keywords": { $in: [null, []] } },
//     ],
//     isDeleted: false,
//   });
// };
// blogPostSchema.statics.aggregateTags = function () {
//   return this.aggregate([
//     { $match: { isDeleted: false } },
//     { $unwind: "$tags" },
//     {
//       $group: {
//         _id: "$tags",
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { count: -1 } },
//   ]);
// };
// blogPostSchema.statics.aggregateCategories = function () {
//   return this.aggregate([
//     { $match: { isDeleted: false } },
//     {
//       $group: {
//         _id: "$category",
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { count: -1 } },
//   ]);
// };
// blogPostSchema.statics.fullTextSearch = function (searchTerm) {
//   return this.find(
//     {
//       $text: { $search: searchTerm },
//       isDeleted: false,
//     },
//     { score: { $meta: "textScore" } }
//   ).sort({ score: { $meta: "textScore" } });
// };
// blogPostSchema.index({
//   title: "text",
//   content: "text",
//   summary: "text",
//   "seo.metaTitle": "text",
//   "seo.metaDescription": "text",
//   tags: "text",
//   category: "text",
// });
// blogPostSchema.pre("remove", function (next) {
//   console.log(`Blog post titled "${this.title}" is being removed.`);
//   next();
// });
// blogPostSchema.post("remove", function (doc) {
//   console.log(`Blog post titled "${doc.title}" has been removed.`);
// });
// blogPostSchema.methods.logDetails = function () {
//   console.log(`Title: ${this.title}`);
//   console.log(`Slug: ${this.slug}`);
//   console.log(`Status: ${this.status}`);
//   console.log(`Category: ${this.category}`);
//   console.log(`Tags: ${this.tags.join(", ")}`);
//   console.log(`Created At: ${this.createdAt}`);
//   console.log(`Updated At: ${this.updatedAt}`);
// };
// blogPostSchema.statics.getStatistics = async function () {
//   const totalPosts = await this.countDocuments({ isDeleted: false });
//   const publishedPosts = await this.countDocuments({
//     status: "published",
//     isDeleted: false,
//   });
//   const draftPosts = await this.countDocuments({
//     status: "draft",
//     isDeleted: false,
//   });
//   const archivedPosts = await this.countDocuments({
//     status: "archived",
//     isDeleted: false,
//   });
//   return {
//     totalPosts,
//     publishedPosts,
//     draftPosts,
//     archivedPosts,
//   };
// };
// blogPostSchema.methods.generateSlugFromTitle = function () {
//   this.slug = this.title
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
//   return this.save();
// };
// blogPostSchema.statics.getMonthlyPostCounts = function () {
//   return this.aggregate([
//     { $match: { isDeleted: false } },
//     {
//       $group: {
//         _id: {
//           year: { $year: "$createdAt" },
//           month: { $month: "$createdAt" },
//         },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { "_id.year": -1, "_id.month": -1 } },
//   ]);
// };
// blogPostSchema.methods.updateContentAndSummary = function (newContent) {
//   this.content = newContent;
//   this.summary =
//     typeof newContent === "string"
//       ? newContent.slice(0, 200) + "..."
//       : JSON.stringify(newContent).slice(0, 200) + "...";
//   return this.save();
// };
// blogPostSchema.statics.getPostsBySEOKeyword = function (keyword) {
//   return this.find({
//     "seo.keywords": keyword,
//     isDeleted: false,
//   });
// };
// blogPostSchema.methods.appendToContent = function (additionalContent) {
//   if (typeof this.content === "string") {
//     this.content += additionalContent;
//   } else {
//     const currentContent = JSON.stringify(this.content);
//     this.content = JSON.parse(currentContent + additionalContent);
//   }
//   return this.save();
// };
// blogPostSchema.statics.getPostsNeedingSEO = function () {
//   return this.find({
//     $or: [
//       { "seo.metaTitle": { $in: [null, ""] } },
//       { "seo.metaDescription": { $in: [null, ""] } },
//       { "seo.keywords": { $in: [null, []] } },
//     ],
//     isDeleted: false,
//   });
// };
// blogPostSchema.methods.updateTags = function (newTags) {
//   this.tags = newTags;
//   return this.save();
// };
// blogPostSchema.statics.getRandomPosts = function (limit = 5) {
//   return this.aggregate([
//     { $match: { isDeleted: false } },
//     { $sample: { size: limit } },
//   ]);
// };
// blogPostSchema.methods.clonePost = function () {
//   const clonedData = this.toObject();
//   delete clonedData._id;
//   clonedData.title = `${clonedData.title} (Copy)`;
//   clonedData.slug = `${clonedData.slug}-copy`;
//   clonedData.status = "draft";
//   const ClonedPost = this.model("BlogPost");
//   const newPost = new ClonedPost(clonedData);
//   return newPost.save();
// };
// blogPostSchema.statics.getPostsByAuthor = function (authorId) {
//   return this.find({ author: authorId, isDeleted: false });
// };
