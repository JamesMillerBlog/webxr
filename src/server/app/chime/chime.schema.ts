import { Schema } from 'dynamoose';

export const ChimeSchema = new Schema({
  meetingId: {
    type: String,
    hashKey: true,
  },
});
