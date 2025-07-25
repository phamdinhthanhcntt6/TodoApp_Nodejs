import { Router } from 'express'
import { createTaskList, getTaskLists, removeTaskList, updateTaskList } from '~/controllers/taskList.controller'

const router = Router()

router.post('/create', createTaskList)
router.get('/get', getTaskLists)
router.delete('/remove', removeTaskList)
router.put('/update', updateTaskList)

export default router
