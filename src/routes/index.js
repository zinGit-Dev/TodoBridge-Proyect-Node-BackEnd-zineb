


const { log } = require('console');
const express = require('express');

const router = express.Router()  //exporto un método de express para generar las rutas

const fs = require("fs")
const path = require('path');

//const TODOS_DB = "src/db/todos.json"

//esto es útil cuando los datos del json no se tienen que modificar, es decir el cliente no tiene en esta app que introducir ningún dato

//const todos = require ("../db/todos.json") , por eso llamaremos nuestros archivos dentro del get 


router.get("/todolist", (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '../db/todos.json')

        fs.readFile(filePath, (err, data) => {
            /*   console.log(">lo q tengo en todos=>", data) */
            const todosData = JSON.parse(data)
            const todoList = todosData.slice(0, 5)
            res.status(200).json({
                data: todoList,
                success: true
            })
        })
        //para hacer el punto 3 , hacer un readFile dentro del primero para sacar la data parseada y luego con esa data hacer un map y luego con lo
        //resulta del map hacemos el slice.en el map hay un if(ele.category === dataCategory.id){ aqui el valor de ele.category tiene que ser ese object}

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

})
router.get("/:id", (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '../db/todos.json')
        fs.readFile(filePath, (err, data) => {
            const todosData = JSON.parse(data)
            /* fs.writeFile(todosData) */

            const todoFilteredById = todosData.filter((todoById) => {

                if (todoById.id == +req.params.id && todoById.id <= todosData.length) {
                    console.log("aqui está todsById=>", todoById)
                    return todoById
                } else {
                    console.log("Sorry, this todo does not exist")
                }
            })
            res.status(200).json({
                data: todoFilteredById,
                status: "ok"
            })
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})




module.exports = router