const Todo = require('../models/todo');

exports.getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find({});
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: "Klaida skaitant duomenis" });
    }
};

exports.getTodoById = async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }
        res.json(todo);
    } catch (err) {
        // Patikrinkite, ar klaida dėl netinkamo ObjectId
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }
        res.status(500).json({ error: "Klaida skaitant duomenis" });
    }
};

exports.createTodo = async (req, res) => {
    try {
        const { title, author, status } = req.body;
        if (!title || !author || !status) {
            return res.status(400).json({ error: "Trūksta laukų užklausoje" });
        }
        const todo = new Todo({ title, author, status });
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ error: "Klaida išsaugant duomenis: " + err.toString() });
    }

};

exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    await Todo.findByIdAndUpdate(id, { status });
    res.json({ message: "Statusas pakeistas" });
};

// @todo: PUT / PATCH / DELTE ...

// // Maršrutas visiškai atnaujinti užduotį
// app.put('/todo/:id', async (req, res) => {
//     const id = req.params.id;
//     try {
//         const todo = await Todo.findById(id);
//         if (!todo) {
//             res.status(404).json({ error: "Elementas nerastas" });
//             return;
//         }

//         const { title, author, status } = req.body;

//         // Patikrinkite, ar visi reikalingi laukeliai yra pateikti
//         if (!title || !author || !status) {
//             res.status(400).json({ error: "Trūksta laukų užklausoje" });
//             return;
//         }

//         // Atnaujinkite užduoties laukus
//         todo.title = title;
//         todo.author = author;
//         todo.status = status;

//         await todo.save(); // Palaukite, kol įrašymas bus baigtas
//         res.json({ message: "Elementas atnaujintas", data: todo });
//     } catch (err) {
//         // Patikrinkite, ar klaida dėl netinkamo ObjectId
//         if (err.name === 'CastError' && err.kind === 'ObjectId') {
//             res.status(404).json({ error: "Elementas nerastas"});
//             return;
//         }
//         res.status(500).json({ error: "Klaida atnaujinant duomenis: " + err.toString() });
//     }
// });

// Maršrutas dalinio užduoties atnaujinimui
// app.patch('/todo/:id', async (req, res) => {
//     const id = req.params.id;
//     try {
//         const todo = await Todo.findById(id);
//         if (!todo) {
//             res.status(404).json({ error: "Elementas nerastas" });
//             return;
//         }

//         const { title, author, status } = req.body;

//         // Atnaujinkite tik tuos laukus, kurie pateikti
//         if (title !== undefined) todo.title = title;
//         if (author !== undefined) todo.author = author;
//         if (status !== undefined) todo.status = status;

//         await todo.save(); // Palaukite, kol įrašymas bus baigtas
//         res.json({ message: "Elementas iš dalies atnaujintas", data: todo });
//     } catch (err) {
//         // Patikrinkite, ar klaida dėl netinkamo ObjectId
//         if (err.name === 'CastError' && err.kind === 'ObjectId') {
//             res.status(404).json({ error: "Elementas nerastas" });
//             return;
//         }
//         res.status(500).json({ error: "Klaida atnaujinant duomenis: " + err.toString() });
//     }
// });

// // Maršrutas ištrinti užduotį
// app.delete('/todo/:id', async (req, res) => {
//     const id = req.params.id;
//     try {
//         const deletedTodo = await Todo.findByIdAndDelete(id);
//         if (!deletedTodo) {
//             res.status(404).json({ error: "Elementas nerastas" });
//             return;
//         }
//         res.json({ message: `Elementas ištrintas: ${deletedTodo.title}` });
//     } catch (err) {
//         // Patikrinkite, ar klaida dėl netinkamo ObjectId
//         if (err.name === 'CastError' && err.kind === 'ObjectId') {
//             res.status(404).json({ error: "Elementas nerastas" });
//             return;
//         }
//         res.status(500).json({ error: "Klaida trinant duomenis: " + err.toString() });
//     }
// });

// // Maršrutas pažymėti užduotį kaip atliktą
// app.post('/todo/:id/done', async (req, res) => {
//     const id = req.params.id;
//     try {
//         const todo = await Todo.findById(id);
//         if (!todo) {
//             res.status(404).json({ error: "Elementas nerastas" });
//             return;
//         }

//         todo.status = "done";
//         await todo.save(); // Palaukite, kol įrašymas bus baigtas
//         res.json({ message: "Darbas atliktas", data: todo });
//     } catch (err) {
//         // Patikrinkite, ar klaida dėl netinkamo ObjectId
//         if (err.name === 'CastError' && err.kind === 'ObjectId') {
//             res.status(404).json({ error: "Elementas nerastas" });
//             return;
//         }
//         res.status(500).json({ error: "Klaida atnaujinant duomenis: " + err.toString() });
//     }
// });
// // Maršrutas atšaukti užduotį
// app.post('/todo/:id/cancel', async (req, res) => {
//     const id = req.params.id;
//     try {
//         const todo = await Todo.findById(id);
//         if (!todo) {
//             res.status(404).json({ error: "Elementas nerastas" });
//             return;
//         }

//         todo.status = "cancelled";
//         await todo.save();
//         res.json({ message: "Darbas atšauktas", data: todo });
//     } catch (err) {
//         // Patikrinkite, ar klaida dėl netinkamo ObjectId
//         if (err.name === 'CastError' && err.kind === 'ObjectId') {
//             res.status(404).json({ error: "Elementas nerastas" });
//             return;
//         }
//         res.status(500).json({ error: "Klaida atnaujinant duomenis: " + err.toString() });
//     }
// });