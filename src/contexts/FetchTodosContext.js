import {  collection, getDocs } from 'firebase/firestore/lite';
import React, { createContext, useEffect, useState } from 'react'
import { firestore } from '../config/firebase';


export const FetchTodosContext = createContext();
export default function FetchTodosContextProvider(props) {
    const [fetchTodos, setFetchTodos] = useState([])

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


    return (
        <FetchTodosContext.Provider   value={{fetchTodos, fetchedTodos,setFetchTodos}}>
            {props.children}
        </FetchTodosContext.Provider>
    )
}
