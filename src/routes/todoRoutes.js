const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { cacheMiddleware } = require('../middlewares/cacheMiddleware');
const acl = require('../middlewares/accessControl');

// Pagrindiniai CRUD maršrutai
router.get('/', acl.checkPermission('read_own_todos'), todoController.getAllTodos);
router.get('/:id', cacheMiddleware, acl.checkPermission('read_own_todos'), todoController.getTodoById);
router.post('/', acl.checkPermission('create_todo'), todoController.createTodo);
router.put('/:id', acl.checkPermission('update_own_todo'), todoController.updateTodo);
router.delete('/:id', acl.checkPermission('delete_own_todo'), todoController.deleteTodo);

// Užduočių būsenų valdymo maršrutai
router.post('/:id/done', acl.checkPermission('update_own_todo'), todoController.markTodoAsDone);
router.post('/:id/cancel', acl.checkPermission('update_own_todo'), todoController.cancelTodo);
router.patch('/:id/status', acl.checkPermission('update_own_todo'), todoController.changeStatus);

module.exports = router;