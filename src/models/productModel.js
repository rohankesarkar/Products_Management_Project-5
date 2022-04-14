let mongoose = require("mongoose");



let productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique:true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      match:[/^\d{0,8}(\.\d{1,2})?$/,"phone number is invalid"]
    },
    currencyId: {
      type: String,
      required: true,
    },
    currencyFormat: {
      type: String,
      required: true,
    },

    isFreeShipping: {
      type: Boolean,
      default: false,
    },

    productImage: {
      type: String,
      required: true,
    },

    style: {
      type: String,
    },
    availableSizes: {
        type: [String],
        required: true
      
    },
    installments: {
      type: Number,
      default:0
      
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);




module.exports = mongoose.model("Product32", productSchema);