const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { cacheMiddleware } = require('../middlewares/cacheMiddleware');
const corsHandler = require('../middlewares/corsHandler');

router.get('/', corsHandler, todoController.getAllTodos);
router.get('/:id', corsHandler, cacheMiddleware, todoController.getTodoById);
router.post('/', corsHandler, todoController.createTodo);
router.put('/:id', corsHandler, todoController.updateTodo);
router.patch('/:id', corsHandler, todoController.partialUpdateTodo);
router.delete('/:id', corsHandler, todoController.deleteTodo);
router.post('/:id/done', corsHandler,  todoController.markTodoAsDone);
router.post('/:id/cancel', corsHandler, todoController.cancelTodo);
router.put('/:id', corsHandler, todoController.changeStatus);

module.exports = router;