// Prieigos kontrolės tarpinė programinė įranga
// Šis modulis apibrėžia prieigos kontrolės mechanizmą programai.
// Jis valdo leidimus pagal vartotojų roles ir užtikrina, kad vartotojai galėtų atlikti tik tuos veiksmus, kuriuos jie yra įgalioti daryti.

const accessControl = {
    roles: {
        // Apibrėžti roles ir jų atitinkamus leidimus
        // 'user' gali skaityti, kurti, atnaujinti ir ištrinti savo užduotis
        // 'manager' gali atlikti operacijas su savo ir komandos užduotimis
        // 'admin' turi leidimus atlikti bet kokią operaciją su užduotimis
        user: ['read_own_todos', 'create_todo', 'update_own_todo', 'delete_own_todo'],
        manager: ['read_own_todos', 'read_team_todos', 'create_todo', 'update_team_todo', 'delete_team_todo'],
        admin: ['read_all_todos', 'create_todo', 'update_any_todo', 'delete_any_todo']
    },

    // Funkcija patikrinti, ar vartotojas turi reikiamą leidimą
    checkPermission: (requiredPermission) => {
        return async (req, res, next) => {
            try {
                const user = req.user; // Gauti vartotoją iš autentifikavimo tarpinės programinės įrangos
                
                // Patikrinti, ar vartotojas turi reikiamą rolę
                const userPermissions = accessControl.roles[user.role];
                
                if (!userPermissions || !userPermissions.includes(requiredPermission)) {
                    return res.status(403).json({
                        error: 'Nepakankami leidimai'
                    });
                }

                // 'own' operacijoms, patikrinti, ar užduotis priklauso vartotojui
                if (requiredPermission.includes('own_') && req.params.id) {
                    const todo = await Todo.findById(req.params.id);
                    if (!todo || todo.userId.toString() !== user._id.toString()) {
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
};

// Eksportuoti accessControl objektą naudoti kitiems programos moduliams
module.exports = accessControl;