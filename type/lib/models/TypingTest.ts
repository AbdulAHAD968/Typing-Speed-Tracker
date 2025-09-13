import mongoose, { Document, Model } from 'mongoose';

export interface ITypingTest extends Document {
  userId: mongoose.Types.ObjectId;
  wpm: number;
  accuracy: number;
  time: number;
  createdAt: Date;
}

const TypingTestSchema = new mongoose.Schema<ITypingTest>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.TypingTest || mongoose.model<ITypingTest>('TypingTest', TypingTestSchema);