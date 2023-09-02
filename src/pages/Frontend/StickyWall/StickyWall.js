import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import { AiOutlinePlus,AiOutlineEdit } from 'react-icons/ai'
import { PiTrashLight } from 'react-icons/pi'
import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore/lite'
import { firestore } from '../../../config/firebase'


const initialState = { title: "", date: "", list: "", description: "", color: "" }
export default function StickyWall() {
  const [state, setState] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchTodos, setFetchTodos] = useState([])

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))


  const fetchedTodos = async () => {

    let allTodos = [];

    const querySnapshot = await getDocs(collection(firestore, "todosList"));

    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      const data = doc.data()
      allTodos.push(data)
    });
    setFetchTodos(allTodos)

  }

  useEffect(() => {
    fetchedTodos()
  }, [])


  const handleAddTodo = async (e) => {

    e.preventDefault();

    let { title, date, description, list, color } = state
    title = title.trim()
    description = description.trim()

    if (title < 3) {
      message.error('Enter title correctly')
      return
    }
    if (description < 10) {
      message.error('Enter description correctly')
      return
    }

    let todoData = {
      title, description, date, list, color,
      dateCreated: serverTimestamp(),
      id: Math.random().toString(36).slice(2),
      status: "active",
      createdBy: {    // Filhal yao createdBy wala data static rakha ha idr login hony waly user ka data ay ga 
        userName: 'Umar',
        email: 'umar30qasim@gmail.com',
        uid: 'randomId'
      }
    }

    setIsLoading(true)
    try {
      await setDoc(doc(firestore, "todosList", todoData.id), todoData);
      console.log('Todo Added Successfully !!')
      message.success('A new added successfully !!!')
      fetchedTodos();
    }

    catch (e) {
      console.error('There is an error while adding a todo ', e)
      message.error('There is an error while adding a todo')
    }
    setIsLoading(false)
    setState({ title: "", description: "", color: "", list: "", date: "" })

  }

  return (

    <>
      <div className="py-2">
        <div className="container">

          <div className="row">
            <div className="col">
              <h2>Sticky Wall </h2>
            </div>
          </div>

          <div className=" row">


            {fetchTodos.map((todo) => {
              return (
                <div className="col-12 col-md-4 " style={{  height: '35vh', }}>
                  <div className="row">
                    <div className="col m-2 rounded-3 stickyTodo" style={{ background: todo.color, height: '31vh', }}>

                      <div className="row">
                        <div className="col ">
                          <h6 className='mt-3'> Title</h6>
                          <p>{todo.title}</p>

                          <h6 className='mt-1'> Description</h6>
                          <p>{todo.description}</p>
                          
                          <p > <b>Date : {todo.date}</b> </p>
                       
                        </div>

                        <div className="col">
                          
                          <div className="row">
                            <div className="col text-end ">
                          <button className='btn btn-sm'><AiOutlineEdit className='text-primary' size={20}/></button>
                          <button className='btn btn-sm '><PiTrashLight size={20}  className='text-danger'/></button>

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
                    <input type="text" className='form-control' onChange={handleChange} name='title' required placeholder='Enter Todo Title' />
                  </div>
                </div>

                <div className="row mb-3">

                  <div className="col-12 col-md-4 mb-3 mb-md-0">
                    <input type="date" required onChange={handleChange} name='date' className='form-control' />
                  </div>

                  <div className="col-12 col-md-4 mb-3 mb-md-0">
                    <select name="Select List Type" className='form-select form-select-md' aria-label=".form-select-lg example">
                      <option className=''>Abc</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-4 mb-3 mb-md-0 ">
                    <input type="color" name='color' required onChange={handleChange} className='form-control form-control-color' />
                  </div>

                </div>

                <div className="row">

                  <div className="col">
                    <textarea required className='form-control' name='description' cols="10" rows="3" onChange={handleChange} placeholder='Description' />
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

    </>

  )
}
