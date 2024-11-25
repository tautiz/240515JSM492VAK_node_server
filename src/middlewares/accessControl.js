const accessControl = {
    roles: {
        user: ['read_own_todos', 'create_todo', 'update_own_todo', 'delete_own_todo'],
        manager: ['read_own_todos', 'read_team_todos', 'create_todo', 'update_team_todo', 'delete_team_todo'],
        admin: ['read_all_todos', 'create_todo', 'update_any_todo', 'delete_any_todo']
    },

    checkPermission: (requiredPermission) => {
        return async (req, res, next) => {
            try {
                const user = req.user; // Gauname vartotoją iš auth middleware
                
                // Tikriname ar vartotojas turi reikiamą rolę
                const userPermissions = accessControl.roles[user.role];
                
                if (!userPermissions || !userPermissions.includes(requiredPermission)) {
                    return res.status(403).json({
                        error: 'Insufficient permissions'
                    });
                }

                // Jei tai "own" operacija, tikriname ar todo priklauso vartotojui
                if (requiredPermission.includes('own_') && req.params.id) {
                    const todo = await Todo.findById(req.params.id);
                    if (!todo || todo.userId.toString() !== user._id.toString()) {
                        return res.status(403).json({
                            error: 'Not authorized to access this resource'
                        });
                    }
                }

                next();
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
    }
};

module.exports = accessControl;