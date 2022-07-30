const express = require('express')
const employee = require('../models/employee')
const Employee = require('../models/employee')
const employeeRouter = express.Router()

employeeRouter.get('/', (req, res, next) => {
    Employee.find((err, comments) => {
        if (err) {
            res.status(500)
            return next(err)
        }
        return res.status(200).send(comments)
    })
})

employeeRouter.post('/', (req, res, next) => {
    const employee = new Employee(req.body)
    employee.save((err, savedComment) => {
        if (err) {
            res.status(500)
            return next(err)
        }
        return res.status(201).send(savedComment)
    })
})

employeeRouter.put('/:employeeId', (req, res, next) => {
    employee.findByIdAndUpdate(req.params.employeeId, {...req.body}, (err, update) => {
        if(err){
            res.status(500)
            return next(err)
          }
          return res.status(200).send(`Successfully delete todo: ${update}`)

    })
})

employeeRouter.delete('/:employeeId', (req, res, next) => {
    employee.findOneAndDelete({_id: req.params.employeeId},  (err, deletedEmployee) => {
        if(err){
          res.status(500)
          return next(err)
        }
        return res.status(200).send(`Successfully delete todo: ${deletedEmployee}`)
      })
})

module.exports = employeeRouter