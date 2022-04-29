import { useState, useEffect } from 'react';
import './App.css';

import api from './services/api';

function App() {
  const [inputValue, setInputValue] = useState('');

  const [tasks, setTasks] = useState([]);

  // function newElement() {
  //   setTasks((prev) => [...prev, inputValue]);
  //   setInputValue('');
  // }

  async function newElement() {
    const response = await api.post('/tasks', {
      title: inputValue,
    });
    const task = response.data;

    setTasks((prev) => [...prev, task]);
  }

  useEffect(() => {
    api.get('/tasks').then((response) => {
      setTasks(response.data);
    });
  }, []);

  return (
    <div className='App'>
      <h1>TAREFAS</h1>
      <main>
        <div>
          <h2>Lista</h2>

          <input
            value={inputValue}
            placeholder='Tarefa...'
            onChange={(event) => setInputValue(event.target.value)}
          />

          <button onClick={() => newElement()}>Adicionar</button>
        </div>

        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
