/*import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the Transaction document
interface ITransaction extends Document {
  product_id: string;
  amount: number;
  status: "PENDING" | "COMPLETE" | "FAILED" | "REFUNDED";
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Transaction schema
const transactionSchema: Schema<ITransaction> = new Schema(
  {
    product_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Amount should not be negative
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "COMPLETE", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create the Transaction model from the schema
const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

// Export the model
export default Transaction;
*/
