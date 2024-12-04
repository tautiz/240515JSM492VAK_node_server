'use strict';

const Todo = require('../models/todo');

class AccessControl {
    constructor() {
        this.roles = {
            user: ['read_own_todos', 'create_todo', 'update_own_todo', 'delete_own_todo'],
            manager: ['read_own_todos', 'read_team_todos', 'create_todo', 'update_team_todo', 'delete_team_todo'],
            admin: ['read_all_todos', 'create_todo', 'update_any_todo', 'delete_any_todo']
        };
    }

    hasPermission(userRole, requiredPermission) {
        const userPermissions = this.roles[userRole];
        return userPermissions && userPermissions.includes(requiredPermission);
    }

    async verifyResourceOwnership(userId, todoId) {
        const todo = await Todo.findById(todoId);
        return todo && todo.userId.toString() === userId.toString();
    }

    checkPermission(requiredPermission) {
        return async (req, res, next) => {
            try {
                const user = req.user;
                
                if (!this.hasPermission(user.role, requiredPermission)) {
                    return res.status(403).json({
                        error: 'Nepakankami leidimai'
                    });
                }

                if (requiredPermission.includes('own_') && req.params.id) {
                    const hasOwnership = await this.verifyResourceOwnership(user._id, req.params.id);
                    if (!hasOwnership) {
                        return res.status(403).json({
                            error: 'Neturite teisės prieiti prie šio resurso'
                        });
                    }
                }

                next();
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }
}

module.exports = new AccessControl();