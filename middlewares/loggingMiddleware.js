// // middleware/loggingMiddleware.js
// const ActivityLog = require('../models/activityLog');

// const createLoggingMiddleware = (schema, modelName) => {
//   // Log on save (CREATE)
//   schema.pre('save', async function(next) {
//     if (this.isNew) {
//       try {
//         await ActivityLog.create({
//           userId: this.user || this._user, // Assuming user ID is passed
//           action: 'create',
//           modelName: modelName,
//           documentId: this._id,
//           details: this.toObject()
//         });
//       } catch (error) {
//         console.error('Logging error:', error);
//       }
//     }
//     next();
//   });

//   // Log on update
//   schema.pre('findOneAndUpdate', async function(next) {
//     try {
//       const docToUpdate = await this.model.findOne(this.getQuery());
//       if (docToUpdate) {
//         await ActivityLog.create({
//           userId: this.options._user, // User ID passed in options
//           action: 'update',
//           modelName: modelName,
//           documentId: docToUpdate._id,
//           details: {
//             before: docToUpdate.toObject(),
//             updates: this.getUpdate()
//           }
//         });
//       }
//     } catch (error) {
//       console.error('Logging error:', error);
//     }
//     next();
//   });

//   // Log on delete
//   schema.pre('findOneAndDelete', async function(next) {
//     try {
//       const docToDelete = await this.model.findOne(this.getQuery());
//       if (docToDelete) {
//         await ActivityLog.create({
//           userId: this.options._user, // User ID passed in options
//           action: 'delete',
//           modelName: modelName,
//           documentId: docToDelete._id,
//           details: docToDelete.toObject()
//         });
//       }
//     } catch (error) {
//       console.error('Logging error:', error);
//     }
//     next();
//   });
// };

// module.exports = createLoggingMiddleware;
// middleware/loggingMiddleware.js
const ActivityLog = require('../models/activityLog');

const createLoggingMiddleware = (schema, modelName) => {
  // Log on save (CREATE)
  schema.pre('save', async function(next) {
    if (this.isNew) {
      try {
        await ActivityLog.create({
          userId: this.user || this._user, // Use the user or _user field directly
          action: 'create',
          modelName: modelName,
          documentId: this._id,
          details: this.toObject()
        });
      } catch (error) {
        console.error('Logging error:', error);
      }
    }
    next();
  });

  // Log on update
  schema.pre('findOneAndUpdate', async function(next) {
    try {
      const docToUpdate = await this.model.findOne(this.getQuery());
      if (docToUpdate) {
        await ActivityLog.create({
          userId: docToUpdate.user || docToUpdate._user, // Use the user or _user field from the document
          action: 'update',
          modelName: modelName,
          documentId: docToUpdate._id,
          details: {
            before: docToUpdate.toObject(),
            updates: this.getUpdate()
          }
        });
      }
    } catch (error) {
      console.error('Logging error:', error);
    }
    next();
  });

  // Log on delete
  schema.pre('findOneAndDelete', async function(next) {
    try {
      const docToDelete = await this.model.findOne(this.getQuery());
      if (docToDelete) {
        await ActivityLog.create({
          userId: docToDelete.user || docToDelete._user, // Use the user or _user field from the document
          action: 'delete',
          modelName: modelName,
          documentId: docToDelete._id,
          details: docToDelete.toObject()
        });
      }
    } catch (error) {
      console.error('Logging error:', error);
    }
    next();
  });
};

module.exports = createLoggingMiddleware;