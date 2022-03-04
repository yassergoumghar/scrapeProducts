const mongoose = require('mongoose')

//) Product Model: Name, Category, Price, Description, Pictures, Reviews.
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please put the Product's name"],
    },
    price: {
      type: Number,
      required: [true, "Please put the Product's price"],
    },
    preview: {
      type: String,
      // required: [true, 'PLease put the product preview picture'],
    },
    images: {
      type: Array,
    },
    reference: {
      type: String,
      // unique: true,
      // required: [true, "Please put the Product's ref"],
      //) Add unique
    },
    active: {
      type: Boolean,
      default: true,
    },
    description: {
      type: Array,
      required: [true, "Please put the Product's description"],
    },
    ficheTechnique: {
      type: Array,
    },
    presentation: {
      type: Array,
    },
    shortDescription: {
      type: Array,
    },
    category: {
      type: String,
      required: [true, "Please put the Product's category, and it's either: "],
      enum: ['manuel', 'fournitures'],
    },
    // slug: String,
    // brand: {
    //   type: String,
    //   enum: ['louisVuitton', 'chanel', 'hermes', 'gucci'],
    //   required: [
    //     true,
    //     "Please put the Product's brand, and it's either: 'louisVuitton', 'chanel', 'hermes', 'gucci' ",
    //   ],
    // },
    // pictures: {
    //   type: Array,
    //   required: [true, "Please put the Product's pictures"],
    // },
    // sale: Boolean,
    // length: {
    //   type: Number,
    //   default: undefined,
    // },
  },
  //) Make sure when we have a field not stored in the database but calculated later show up in the Database
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
)

//* Indexes
// productSchema.index({ slug: 1 }, { unique: true })
// productSchema.index({ reference: 1 }, { unique: true })

// Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
})

//) Hide the *deleted* Products
productSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } })
  next()
})

//* DOCUMENT MIDDLEWARE: runs before .save() and .create()
// productSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true })
//   next()
// })

const Product = mongoose.model('Product', productSchema, 'products')

module.exports = Product
