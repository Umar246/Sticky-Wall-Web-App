import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import { AiOutlinePlus, AiOutlineEdit } from 'react-icons/ai'
import { PiTrashLight } from 'react-icons/pi'
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore/lite'
import { auth, firestore } from '../../../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'


const initialState = { title: "", date: "", list: "", description: "", color: "" }
export default function StickyWall() {

  // UseState Hooks
  const [state, setState] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [editTodo, setEditTodo] = useState({})
  const [fetchTodos, setFetchTodos] = useState([])
  const [users, setUsers] = useState([])
  const [userData, setUserData] = useState([])


  // __________________________________________________________________________________________________________________________________________

  // Handle Change (to get value from inputs)
  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  // _________________________________________________________________________________________________________________________________________

  // Handle Change For EDit Todo Modal

  const handleChangeForEdit = (e) => {

    setEditTodo({ ...editTodo, [e.target.name]: e.target.value })

  }
  // _________________________________________________________________________________________________________________________________________
  // OnAuthStateChanged (To get loged in user)
  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {

        // console.log('user', user)
        setUsers(user)

      } else {
        console.log('User not Found (StickyWall Todos)',)
      }
    });

  }, [])

  // __________________________________________________________________________________________________________________________________________

  //To get users from firestore
  const showUserData = async () => {
    const querySnapshot = await getDocs(collection(firestore, "users"));

    const usersData = []
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      usersData.push(data)
      console.log('data', data)
    });
    setUserData(usersData)
  }
  useEffect(() => {
    showUserData()
  }, [])


  // __________________________________________________________________________________________________________________________________________


  const logedInUser = userData.find((user) => {
    return user.id === users.id
  })
  // console.log('logedInUser', logedInUser)



  // __________________________________________________________________________________________________________________________________________

  // FetchDocs (For fething document from firestore )
  const fetchedTodos = async () => {

    let allTodos = [];

    const querySnapshot = await getDocs(collection(firestore, "todosList"));

    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      const data = doc.data()
      allTodos.push(data)
    });
    setFetchTodos(allTodos)

  }

  useEffect(() => {
    fetchedTodos()
  }, [])


  // __________________________________________________________________________________________________________________________________________



  // Handle Add Todo (For storing doc in firestoring)
  const handleAddTodo = async (e) => {

    e.preventDefault();

    let { title, date, description, list, color } = state
    title = title.trim()
    description = description.trim()

    if (title.length < 3) {
      message.error('Enter title correctly')
      return
    }
    if (description.length < 10) {
      message.error('Enter description correctly')
      return
    }



    let todoData = {
      title, description, date, list, color,
      dateCreated: serverTimestamp(),
      id: Math.random().toString(36).slice(2),
      status: "active",
      createdBy: {    // Filhal yao createdBy wala data static rakha ha idr login hony waly user ka data ay ga 
        userName: logedInUser.name,
        email: logedInUser.email,
        uid: logedInUser.uid,
      }
    }

    setIsLoading(true)
    try {
      await setDoc(doc(firestore, "todosList", todoData.id), todoData);
      console.log('Todo Added Successfully')
      message.success('A new added successfully')
      fetchedTodos();

      setState(initialState)
    }

    catch (e) {
      console.error('There is an error while adding a todo ', e)
      message.error('There is an error while adding a todo')
    }
    setIsLoading(false)


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
    message.success("Todo Deleted Successfully")
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
    message.success('Todo Edited Successfully')
    setEditTodo(initialState)



  }


  return (

    <>
      <div className="py-2">
        <div className="container">

          <div className="row">
            <div className="col">
              <h2>Sticky Wall <sup className='text-primary' style={{ fontSize: '20px', }}>({fetchTodos.length})</sup> </h2>
            </div>
          </div>

          <div className=" row">


            {fetchTodos.map((todo) => {

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
                            <div className="col text-end">

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

            <div className="col-12 col-md-4  " style={{ height: '35vh', }}>


              <div className="row">
                <div className="col mt-2 rounded-3  " style={{ height: '31vh', }}>

                  <button className='btn btn-outline-warning w-100 h-100 ' data-bs-target="#newTodoModal" data-bs-toggle="modal"><span><AiOutlinePlus size={40} /></span></button>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>





      {/* <!-- Modal --> */}
      <div className="modal fade" id="newTodoModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Add Todo</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">


              {/* Form (Modal) */}
              <form>

                <div className="row mb-3">
                  <div className="col">
                    <input type="text" className='form-control' value={state.title} onChange={handleChange} name='title' required placeholder='Enter Todo Title' />
                  </div>
                </div>

                <div className="row mb-3">

                  <div className="col-12 col-md-4 mb-3 mb-md-0">
                    <input type="date" value={state.date} required onChange={handleChange} name='date' className='form-control' />
                  </div>

                  <div className="col-12 col-md-4 mb-3 mb-md-0">
                    <select name="Select List Type" value={state.list} className='form-select form-select-md' aria-label=".form-select-lg example">
                      <option >Other</option>
                      <option>Office</option>
                      <option >Home</option>
                      <option >Personal</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-4 mb-3 mb-md-0 ">
                    <input type="color" name='color' value={state.color} required onChange={handleChange} className='form-control form-control-color' />
                  </div>

                </div>

                <div className="row">

                  <div className="col">
                    <textarea required value={state.description} className='form-control' name='description' cols="10" rows="3" onChange={handleChange} placeholder='Description' />
                  </div>

                </div>

                <div className="modal-footer mb-0">

                  {!isLoading
                    ? <button type="button" className="btn btn-outline-primary mb-0 w-100" onClick={handleAddTodo}>Add Todo</button>
                    : <button type="button" className="btn btn-outline-primary mb-0 w-100" disabled={isLoading}><div className='spinner-border spinner-border-sm'></div></button>
                  }

                </div>


              </form>
            </div>

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
                    <input type="date" value={editTodo.date} required onChange={handleChangeForEdit} name='date' className='form-control' />
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
