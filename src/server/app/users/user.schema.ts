import { Schema } from 'dynamoose';

export const UserSchema = new Schema({
  uid: {
    type: String,
    hashKey: true,
  },
  role: {
    type: String,
  },
  avatar: {
    type: String,
  },
  userMode: {
    type: String,
  },
  userName: {
    type: String,
  },
  image: {
    type: String,
  },
});
