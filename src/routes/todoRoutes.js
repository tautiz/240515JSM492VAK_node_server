const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { cacheMiddleware } = require('../middlewares/cacheMiddleware');
const { checkPermission } = require('../middlewares/accessControl');

router.get('/', checkPermission('read_own_todos'), todoController.getAllTodos);
router.get('/:id', cacheMiddleware, checkPermission('read_own_todos'), todoController.getTodoById);
router.post('/', checkPermission('create_todo'), todoController.createTodo);
router.put('/:id', checkPermission('update_own_todo'), todoController.updateTodo);
router.patch('/:id', checkPermission('update_own_todo'), todoController.partialUpdateTodo);
router.delete('/:id', checkPermission('delete_own_todo'), todoController.deleteTodo);
router.post('/:id/done', checkPermission('update_own_todo'), todoController.markTodoAsDone);
router.post('/:id/cancel', checkPermission('update_own_todo'), todoController.cancelTodo);
router.put('/:id', checkPermission('update_own_todo'), todoController.changeStatus);

module.exports = router;