import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from "./AddItemForm";

export type FilterValuesType = "all" | "active" | "completed";
type TodolistType = {
    id: string
    title: string
    filter: string
}

type TasksStateType = {
    [key: string]: TaskType[]
}


function App() {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true}
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "React Book", isDone: true},
            {id: v1(), title: "Beer", isDone: true},
            {id: v1(), title: "Fruits", isDone: true}
        ]
    });

    const changeTaskTitle = (id: string, todolistId: string, newTitle: string) => {
      setTasks({...tasks, [todolistId]: tasks[todolistId].map(el=> el.id === id ? {...el, title: newTitle}: el)})
    }

    const changeTodolistTitle = (todolistId: string, newTitle: string) => {
        setTodolists(todolists.map(el=> el.id === todolistId ? {...el, title: newTitle}: el))
    }

    const addTodolist = (title: string) => {
        let newTodolistId = v1();
        let newTodolist = {id: newTodolistId, title: title, filter: "all"}
        setTodolists([newTodolist, ...todolists])
        setTasks({...tasks, [newTodolistId]: []})
    }


    function removeTask(id: string, todolistId: string) {
       setTasks({...tasks, [todolistId]: tasks[todolistId].filter(el=> el.id !== id)})
    }

    function addTask(title: string, todolistId: string) {
       let task = {id: v1(), title: title, isDone: false}
        setTasks({...tasks, [todolistId]: [task, ...tasks[todolistId]]})
    }

    function changeStatus(id: string, isDone: boolean, todolistId: string) {
        setTasks({...tasks, [todolistId]: tasks[todolistId].map(el=> el.id === id ? {...el, isDone: isDone}: el)})
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        setTodolists(todolists.map(el=>el.id === todolistId ? {...el, filter: value}: el))
    }

    function removeTodolist(id: string) {
        setTodolists(todolists.filter(el=>el.id !== id))
    }

    return (
        <div className="App">

            <AddItemForm callback={(newTitle)=>addTodolist(newTitle)}/>

            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];
                    let tasksForTodolist = allTodolistTasks;

                    if (tl.filter === "active") {
                        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
                    }
                    if (tl.filter === "completed") {
                        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
                    }

                    return <Todolist
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeStatus}
                        filter={tl.filter}
                        removeTodolist={removeTodolist}
                        changeTaskTitle={changeTaskTitle}
                        changeTodolistTitle={changeTodolistTitle}
                    />
                })
            }

        </div>
    );
}

export default App;
