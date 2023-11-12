import { Schema } from 'dynamoose';

export const ConnectionSchema = new Schema({
  uid: {
    type: String,
    hashKey: true,
  },
});
