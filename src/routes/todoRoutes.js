const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { cacheMiddleware } = require('../middlewares/cacheMiddleware');
const corsHandler = require('../middlewares/corsHandler');
const auth = require('../middlewares/auth');

router.get('/', corsHandler, auth, todoController.getAllTodos);
router.get('/:id', corsHandler, auth, cacheMiddleware, todoController.getTodoById);
router.post('/', corsHandler, auth, todoController.createTodo);
router.put('/:id', corsHandler, auth, todoController.updateTodo);
router.patch('/:id', corsHandler, auth, todoController.partialUpdateTodo);
router.delete('/:id', corsHandler, auth, todoController.deleteTodo);
router.post('/:id/done', corsHandler, auth,  todoController.markTodoAsDone);
router.post('/:id/cancel', corsHandler, auth, todoController.cancelTodo);
router.put('/:id', corsHandler, auth, todoController.changeStatus);

module.exports = router;