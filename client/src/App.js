import './App.scss';
import axios from 'axios'
import React, { useState, useEffect } from 'react'

function App() {
  let [employees, setEmployees] = useState([])
  let [renderedEmployees, setRenderedEmployees] = useState([])
  let [employeesChanged, setEmployeesChanged] = useState(false)
  let [showAdd, setShowAdd] = useState(false)
  
  function getEmployees() {
    axios.get('/api/employees')
    .then(response => {
      setEmployees(() => {
          return response.data.map(employee => {
            return {
              employee, 
              editObject: {
                editFirstName: false, 
                editLastName: false, 
                editEmail: false, 
                editPhone: false
              }, 
              editing: false
            }
          })
        })
      })
      .catch(err => {
        console.log(err)
      })
    }
    
    const newEmployeeInit = {
      firstName: '', 
      lastName: '', 
      email: '', 
      phone: '', 
      errors: {
        firstName: false, 
        lastName: false, 
        email: false, 
        phone: false, 
      }, 
      editing: false
    }
    
    let [newEmployee, setNewEmployee] = useState(newEmployeeInit)
    
    function postEmployee() {
      if (!newEmployee.firstName
        || !newEmployee.lastName
        || !newEmployee.email
        || !newEmployee.phone
        ) {
          setNewEmployee(prev => ({
            ...prev, 
            errors: {
              firstName: !newEmployee.firstName ? true : false,
              lastName: !newEmployee.lastName ? true : false,
              email: !newEmployee.email ? true : false, 
              phone: !newEmployee.phone ? true : false
            }
          }))

          return 
        }
        
      axios.post('/api/employees', {
        firstName: newEmployee.firstName, 
        lastName: newEmployee.lastName, 
        email: newEmployee.email, 
        phone: newEmployee.phone
      })
      .then(() => {
        setNewEmployee(newEmployeeInit)
        getEmployees()
        setShowAdd(!showAdd)
      })
      .catch(err => {
        console.log(err)
      })
    }

    function handleEmployeeUpdate(e, index) {

      let employee = {...employees[index].employee}

      if (
        !employee.firstName
        || !employee.lastName
        || !employee.email 
        || !employee.phone
      ) return 

      axios.put(`/api/employees/${employee._id}`, employee)
        .then(response => {

          getEmployees()
        })
        .catch(err => console.log(err))
    }

    function handleChange(e) {
      const {name, value} = e.target 

      setNewEmployee(prev => ({
        ...prev, 
        [name]: value, 
        errors: {
          ...prev.errors, 
          [name]: false
        }
      }))
    }
    
    useEffect(() => {
      getEmployees()
    }, [])
    

    function handleEmployeeChange(e, index, identifier) {
      const { value } = e.target

      setEmployees(prevEmployees => {
        prevEmployees[index] = {
          ...prevEmployees[index], 
          employee: {
            ...prevEmployees[index].employee, 
            [identifier]: value
          }
        }

        return prevEmployees
      })

      setEmployeesChanged(!employeesChanged)
    }

    function deleteEmployee(e, _id) {
      axios.delete(`/api/employees/${_id}`)
        .then(() => {
          getEmployees()
        })
    }

    useEffect(() => {
      let renderedEmployees = employees.map((employee, index) => {
        const editObject = employee?.editObject
        const editing = employee.editing
        employee = employee.employee

        return (
          <tbody key={index}>
            <tr>
              {editing ? <td><button className="editEmployee" onClick={(e) => handleEmployeeUpdate(e, index)}>{`Edit ...${employee._id.substring(16, 24)}`}</button><button onClick={(e) => deleteEmployee(e, employee._id)}>Delete</button></td> : <td onDoubleClick={() => {
                setEmployees(prevEmployees => {
                  setEmployeesChanged(!employeesChanged)
                  prevEmployees[index] = {
                    ...prevEmployees[index], 
                    editObject: {
                      ...prevEmployees[index].editObject,
                    }, 
                    editing: true
                  }
                  return prevEmployees
                })
              }}>{employee._id}</td>}
      
              {editObject?.editFirstName ? <td><input value={employee.firstName} onChange={(e) => handleEmployeeChange(e, index, 'firstName')} /></td>: (<td onDoubleClick={() => {

                setEmployees(prevEmployees => {
                  
                  prevEmployees[index] = {
                    ...prevEmployees[index], 
                    editObject: {
                      ...prevEmployees[index].editObject,
                      editFirstName: !editObject.editFirstName, 
                    }, 
                    editing: true
                  }
                  return prevEmployees
                  
                })
                
                setEmployeesChanged(!employeesChanged)

              }}>{employee.firstName}</td>)}
      
              {editObject?.editLastName ? <td><input value={employee.lastName} onChange={(e) => handleEmployeeChange(e, index, 'lastName')} /></td> : (<td onDoubleClick={() => setEmployees(prevEmployees => {

                setEmployeesChanged(!employeesChanged)
                prevEmployees[index] = {
                  ...prevEmployees[index], 
                  editObject: {
                    ...prevEmployees[index].editObject,
                    editLastName: !editObject?.editLastName, 
                  }, 
                  editing: true
                }
                return prevEmployees
              })}>{employee.lastName}</td>)}

              {editObject?.editEmail ? <td><input value={employee.email} onChange={(e) => handleEmployeeChange(e, index, 'email')} /></td> : <td onDoubleClick={() => setEmployees(prevEmployees => {
                setEmployeesChanged(!employeesChanged)
                prevEmployees[index] = {
                  ...prevEmployees[index], 
                  editObject: {
                    ...prevEmployees[index].editObject,
                    editEmail: !editObject?.email, 
                  }, 
                  editing: true
                }
                return prevEmployees
              })}>{employee.email}</td>}
              
              {editObject?.editPhone ? <td><input value={employee.phone} onChange={(e) => handleEmployeeChange(e, index, 'phone')} /></td> : (<td onDoubleClick={() => setEmployees(prevEmployees => {
                setEmployeesChanged(!employeesChanged)
                prevEmployees[index] = {
                  ...prevEmployees[index], 
                  editObject: {
                    ...prevEmployees[index].editObject,
                    editPhone: !editObject?.editPhone, 
                  }, 
                  editing: true
                }
                return prevEmployees
              })}>{employee.phone}</td>)}
              
            </tr>
          </tbody>
          
          )
      })
  
      setRenderedEmployees(renderedEmployees)
  
    }, [employeesChanged, employees])
    
    return (
    <div className="App">
      {!showAdd ? (
      <section id="newEmployeeSection">
        <button onClick={() => setShowAdd(!showAdd)}>Add New Employee</button>
      </section>) : 
      (<section id="newEmployeeSection">
        <table>
          <thead>
            <tr>
              <th>Id is set automatically</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td><button className="saveEmployee" onClick={postEmployee}>Save new employee</button><button onClick={() => {
                setNewEmployee(newEmployeeInit)
                setShowAdd(!showAdd)
              }}>Exit</button></td>
              <td><input className={newEmployee.errors.firstName ? 'error' : ''} value={newEmployee.firstName} name="firstName" onChange={handleChange} /></td>
              <td><input className={newEmployee.errors.lastName ? 'error' : ''} value={newEmployee.lastName} name="lastName" onChange={handleChange} /></td>
              <td><input className={newEmployee.errors.email ? 'error' : ''} value={newEmployee.email} name="email" onChange={handleChange} /></td>
              <td><input className={newEmployee.errors.phone ? 'error' : ''} value={newEmployee.phone} name="phone" onChange={handleChange} /></td>
            </tr>

          </tbody>

        </table>
      </section>)}

    
    <section id="employeeSection">

      <table>
        <thead>

          <tr>
            <th>ID number</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>

        </thead>
        {renderedEmployees}
      </table>
    </section>

    </div>
  );
}

export default App;
