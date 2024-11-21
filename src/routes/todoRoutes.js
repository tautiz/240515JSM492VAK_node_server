const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { cacheMiddleware } = require('../middlewares/cacheMiddleware');
const auth = require('../middlewares/auth');

router.get('/', auth, todoController.getAllTodos);
router.get('/:id', auth, cacheMiddleware, todoController.getTodoById);
router.post('/', auth, todoController.createTodo);
router.put('/:id', auth, todoController.updateTodo);
router.patch('/:id', auth, todoController.partialUpdateTodo);
router.delete('/:id', auth, todoController.deleteTodo);
router.post('/:id/done', auth, todoController.markTodoAsDone);
router.post('/:id/cancel', auth, todoController.cancelTodo);
router.put('/:id', auth, todoController.changeStatus);

module.exports = router;