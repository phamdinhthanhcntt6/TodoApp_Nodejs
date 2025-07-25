import mongoose from 'mongoose'

const taskListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }
    ]
  },
  {
    timestamps: true
  }
)

const TaskList = mongoose.model('taskList', taskListSchema)
export default TaskList
