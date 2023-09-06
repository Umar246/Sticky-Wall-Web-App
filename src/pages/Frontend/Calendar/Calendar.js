import { message } from 'antd'
import React, { useContext, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { PiTrashLight } from 'react-icons/pi'
import { deleteDoc, doc, setDoc } from 'firebase/firestore/lite'
import { firestore } from '../../../config/firebase'
import { FetchTodosContext } from '../../../contexts/FetchTodosContext'
import { useEffect } from 'react'
import dayjs from 'dayjs'




export default function Calendar() {

  // UseState Hooks

  const [isUpdate, setIsUpdate] = useState(false)
  const [editTodo, setEditTodo] = useState({})
  const [todayDate, setTodayDate] = useState('')
  const [stateForDate, setStateForDate] = useState({})

  // FetchTodosContext sy value mangwa rhy ha yaha 
  const { fetchTodos, setFetchTodos, fetchedTodos } = useContext(FetchTodosContext)

  // _________________________________________________________________________________________________________________________________________

  //  IS file ma srf ya code add hoa ha baki purana ha 
  useEffect(() => {
    const currentDate = dayjs().format('YYYY-MM-DD')
    setTodayDate(currentDate)
    fetchedTodos()

  }, [])
  let calendarTodos = fetchTodos.filter((todoFromFirebase) => todoFromFirebase.date === stateForDate.date)






  // _________________________________________________________________________________________________________________________________________
  //  Handle Change function for Date

  const handleChangeForDate = (e) => {

    setStateForDate(s => ({...s, [e.target.name]: e.target.value}))
  }






  // _________________________________________________________________________________________________________________________________________


  // Handle Change For EDit Todo Modal

  const handleChangeForEdit = (e) => {

    setEditTodo({ ...editTodo, [e.target.name]: e.target.value })

  }

  // __________________________________________________________________________________________________________________________________________


  // Handle Delete  (mtlb button par click kary tou todo delete ho jy firestore sy bhi)
  const handleDelete = async (todoID) => {

    await deleteDoc(doc(firestore, "todosList", todoID.id));
    let afterDeleteTodos = fetchTodos.filter((deleteTodo) => {

      // Jis deleteTodo ki id brabar nai ha toodID.id k us lo waps bhej jo (return) . Jis ki brabar ha us par function chlao mtlb delete kar do
      return deleteTodo.id !== todoID.id
    })
    setFetchTodos(afterDeleteTodos)
    message.success("Todo Deleted Successfully !!!")
  }

  // __________________________________________________________________________________________________________________________________________

  // Handle Edit (is ko click karny par modal open ho ga or values set ho jy gi inputs ma )
  const handleEditTodo = (todo) => {
    setEditTodo(todo)
  }


  //  __________________________________________________________________________________________________________________________________________

  const handleUpdateTodo = async (todoForEdit) => {

    setIsUpdate(true)
    await setDoc(doc(firestore, "todosList", todoForEdit.id), todoForEdit, { merge: true });


    let todoAfterEdit = fetchTodos.map((oldTodo) => {

      if (oldTodo.id === todoForEdit.id) {
        return todoForEdit
      } else {
        return oldTodo
      }
    })

    setFetchTodos(todoAfterEdit)
    setIsUpdate(false)
    message.success('Todo Edited Successfully !!!')
    setEditTodo({})


  }


  return (

    <>
      <div className="py-2">
        <div className="container">

          <div className="row">
            <div className="col">
              <h2>Calendar <sup className='text-primary' style={{ fontSize: '20px', }}>({calendarTodos.length})</sup> </h2>
            </div>
          </div>


          {/* Input Field to select todo date */}

          <div className="row">
            <div className="col-12 col-md-8 my-4 m-auto border border-2 border-warning rounded-3 inputBox p-3" >
              <label className='fw-bold fs-5 mb-2 ms-1 '>Select Date <span className='fs-6 fw-normal text-secondary'>(For todo)</span> </label>
              <input type="date" className='form-control' name='date' required value={stateForDate.date} onChange={handleChangeForDate} />
            </div>
          </div>




          <div className=" row">


            {calendarTodos.map((todo) => {
              return (
                <div className="col-12 col-md-4 " style={{ height: '35vh', }}>
                  <div className="row">
                    <div className="col m-2 rounded-3 stickyTodo" style={{ background: todo.color, height: '31vh', }}>

                      <div className="row">
                        <div className="col ">
                          <h6 className='mt-3'> Title</h6>
                          <p>{todo.title}</p>

                          <h6 className='mt-1'> Description</h6>
                          <p>{todo.description}</p>

                          <p> <b>Date : {todo.date}</b> </p>

                        </div>

                        <div className="col">

                          <div className="row">
                            <div className="col text-end ">

                              <button className='btn btn-sm' data-bs-toggle="modal" data-bs-target="#editTodoModal" onClick={() => handleEditTodo(todo)}><AiOutlineEdit className='text-primary' size={20} /></button>

                              <button className='btn btn-sm ' onClick={() => handleDelete(todo)}><PiTrashLight size={20} className='text-danger' /></button>

                            </div>

                          </div>

                        </div>



                      </div>


                    </div>
                  </div>
                </div>
              )
            })
            }


          </div>

        </div>
      </div>








      {/* _________________________________________________________________________________________________________________________________ */}

      {/* Handle Edit Modal */}


      <div className="modal fade" id="editTodoModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Todo</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">


              {/* Form (Modal) */}
              <form>

                <div className="row mb-3">
                  <div className="col">
                    <input type="text" value={editTodo.title} className='form-control' onChange={handleChangeForEdit} name='title' required placeholder='Enter Todo Title' />
                  </div>
                </div>

                <div className="row mb-3">

                  <div className="col-12 col-md-4 mb-3 mb-md-0">
                    <input type="date" value={editTodo.data} required onChange={handleChangeForEdit} name='date' className='form-control' />
                  </div>

                  <div className="col-12 col-md-4 mb-3 mb-md-0">
                    <select value={editTodo.list} name="Select List Type" className='form-select form-select-md' aria-label=".form-select-lg example">
                      <option className=''>Abc</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-4 mb-3 mb-md-0 ">
                    <input type="color" value={editTodo.color} name='color' required onChange={handleChangeForEdit} className='form-control form-control-color' />
                  </div>

                </div>

                <div className="row">

                  <div className="col">
                    <textarea required className='form-control' value={editTodo.description} name='description' cols="10" rows="3" onChange={handleChangeForEdit} placeholder='Description' />
                  </div>

                </div>

                <div className="modal-footer mb-0">

                  {!isUpdate
                    ? <button type="button" className="btn btn-outline-primary mb-0 w-100" onClick={() => handleUpdateTodo(editTodo)}>Update Todo</button>
                    : <button type="button" className="btn btn-outline-primary mb-0 w-100" disabled={isUpdate}><div className='spinner-border spinner-border-sm'></div></button>
                  }

                </div>


              </form>
            </div>

          </div>
        </div>
      </div>
    </>

  )
}

