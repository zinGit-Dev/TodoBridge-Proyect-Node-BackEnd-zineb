const express = require('express');

const fs = require("fs")
const path = require('path');

const router = express.Router()  //exporto un método de express para generar las rutas

//const TODOS_DB = "src/db/todos.json"

//esto es útil cuando los datos del json no se tienen que modificar, es decir el cliente no tiene en esta app que introducir ningún dato
//..............................................

//const todos = require ("../db/todos.json") , por eso llamaremos nuestros archivos dentro del get 
// router.get("/", (req, res, next) => {
//     try {
//         const filePath = path.join(__dirname, '../db/todos.json')
//         const catfile = path.join(__dirname, '../db/categories.json')

//         fs.readFile(filePath, (err, data) => {
//             const todosData = JSON.parse(data)
//             fs.readFile(catfile, (err, data) => {
//                 const todoCategory = JSON.parse(data)
//                 const result = todosData.map((ele) => {
//                     const category = todoCategory.find(cat => cat.id === ele.category)
//                     return {
//                         ...ele,
//                         category: category
//                     }
//                 })
//                 console.log("esto es result data=>", result)
//                 // const todoList = result.slice(0, 5)
//                 res.status(200).json({
//                     data: result,
//                     success: true
//                 })
//             })
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// })
//.......................he dejado comentado lo que nos trae todos los todos para 
//poder modificarlo sin perder lo anterior, así hacer la paginación
const todosPerPage = 5
const getTodos = (totalTodos, numTodosPerPage) => Math.floor(totalTodos.length / numTodosPerPage)
const toNumber = (value, defaultValue) => {
    const valueToNumber = Number(value);
    return Number.isNaN(valueToNumber) || valueToNumber <= 0 ? defaultValue : valueToNumber;
};
router.get("/", (req, res, next) => {
    try {

        const filePath = path.join(__dirname, '../db/todos.json')
        const catfile = path.join(__dirname, '../db/categories.json')


        fs.readFile(filePath, (err, data) => {
            const todosData = JSON.parse(data)
            const { page, perPage } = req.query;

            fs.readFile(catfile, (err, data) => {
                const todoCategory = JSON.parse(data)
                const result = todosData.map((ele) => {
                    const category = todoCategory.find(cat => cat.id === ele.category)
                    return {
                        ...ele,
                        category: category
                    }
                })
                console.log("esto es result data=>", result)
                const finalPage = toNumber(page, 1)
                const finalPerPage = toNumber(perPage, todosPerPage)
                const endIndex = finalPage * finalPerPage
                const startIndex = endIndex - finalPerPage
                const todoSlice = result.slice(startIndex, endIndex)
                const pages = getTodos(result, finalPerPage)
                const nextPage = finalPage + 1 > pages ? null : finalPage + 1

                res.status(200).json({
                    data: todoSlice,
                    success: true,
                    next: `http://${req.headers.host}/todolist?page=${nextPage}&perPage=${finalPerPage}`,
                })
            })
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})
router.get("/get-todos-by-category",(req, res, next)=>{
    const filePath= path.join(__dirname, "./db/todos.json")
    const catPath = path.join(__dirname, "./db/categories.json")
})

//postman sustituye el front , de donde se supone que llegarán los datos, ahora escribiendo en body hacemos funcion de cliente
router.post("/", (req, res, next) => {

    const filePath = path.join(__dirname, '../db/todos.json')

    fs.readFile(filePath, (err, data) => {
        const todosData = JSON.parse(data)
        console.log("contenido de req.body=>", req.body)
        const result = [...todosData, req.body]
        fs.writeFile(filePath, JSON.stringify(result), (error, data) => {
            if (error) {
                next(error.message)
            }
            res.status(200).json({
                data: result,
                success: true
            })
        })

    })
})
router.post("/category", (req, res, next) => {
    const catfile = path.join(__dirname, '../db/categories.json')
    fs.readFile(catfile, (err, data) => {
        const catData = JSON.parse(data)
        const result = [...catData, req.body]
        fs.writeFile(catfile, JSON.stringify(result), (error, data) => {
            if (error) {
                next(error.message)
            }
            res.status(200).json({
                data: result,
                success: true
            })
        })

    })
})

router.get("/:id", (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '../db/todos.json')
        fs.readFile(filePath, (err, data) => {
            const todosData = JSON.parse(data)
            const todoById = todosData.find(todo => todo.id == req.params.id)

            res.status(200).json({
                data: todoById || 'Este todo no existe',
                status: "ok"
            })
            //este abajo es como lo tenía al principio y arriba como es mejor hacerlo
            //tomar en cuenta == no hace falta transformar a Number(req.params.id)
            // const todoFilteredById = todosData.filter((todoById) => {

            //     if (todoById.id == req.params.id && todoById.id <= todosData.length) {
            //         console.log("aqui está todsById=>", todoById)
            //         return todoById
            //     } else {
            //         console.log("Sorry, this todo does not exist")
            //     }
            // })

            // res.status(200).json({
            //     data: todoFilteredById,
            //     status: "ok"
            // })
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

module.exports = router