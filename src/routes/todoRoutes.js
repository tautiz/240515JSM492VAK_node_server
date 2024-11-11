const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', todoController.createTodo);
// router.put('/:id', todoController.updateTodo);
// router.patch('/:id', todoController.partialUpdateTodo);
// router.delete('/:id', todoController.deleteTodo);
// router.post('/:id/done', todoController.markTodoAsDone);
// router.post('/:id/cancel', todoController.cancelTodo);
router.put('/:id', todoController.changeStatus);

module.exports = router;