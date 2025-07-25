import TaskList from '~/models/tasklist.model'
import { Request, Response } from 'express'

const getTaskLists = async (req: Request, res: Response) => {
  const { id, page = '1', pageSize = '10' } = req.query

  if (!id) {
    res.status(400).json({ message: 'Missing id in query' })
    return
  }

  const pageNum = parseInt(page as string)
  const pageSizeNum = parseInt(pageSize as string)

  try {
    const query = {
      $or: [{ owner: id }, { members: id }]
    }

    const taskLists = await TaskList.find(query)
      .populate('owner')
      .populate('members')
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)

    res.status(200).json({
      data: taskLists,
      total: taskLists.length
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error
    })
  }
}

const createTaskList = async (req: Request, res: Response) => {
  const { name, owner, members } = req.body

  try {
    const newTaskList = new TaskList({ name, owner, members })
    await newTaskList.save()

    res.status(200).json({
      message: 'Task list created successfully',
      taskList: newTaskList
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error
    })
  }
}

const removeTaskList = async (req: Request, res: Response) => {
  const { id } = req.body

  try {
    await TaskList.deleteOne({ _id: id })
    res.status(200).json({
      message: 'Task list removed successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error
    })
  }
}

const updateTaskList = async (req: Request, res: Response) => {
  const { id } = req.query
  const { name, members, owner } = req.body

  try {
    await TaskList.updateOne({ _id: id }, { name, members, owner })
    res.status(200).json({
      message: 'Task list updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error
    })
  }
}

export { createTaskList, getTaskLists, removeTaskList, updateTaskList }
