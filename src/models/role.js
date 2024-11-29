import mongoose from 'mongoose';
import { atleastOnePermission, arePermissionsValid } from '../utils/helperFunctions.js';
import { REGEX } from '../constants/index.js';

const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'Role title is required'],
      maxLength: [50, 'Role title cannot exceed 50 characters'],
      match: [REGEX.NAME, 'Role title must contain only letters'],
    },
    permissions: {
      type: [String],
      validate: [
        {
          validator: atleastOnePermission,
          message: 'A role must have atleast one permission',
        },
        {
          validator: arePermissionsValid,
          message: 'One or more permissions are invalid',
        },
      ],
    },
    userCount: {
      type: Number,
      default: 0,
      min: [0, 'User count for a role cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'User count must be an integer',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Role', roleSchema);
