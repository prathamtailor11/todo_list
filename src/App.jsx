import React, { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('todos') || '[]')
    } catch (e) {
      return []
    }
  })
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  function addTodo(e) {
    e.preventDefault()
    const v = text.trim()
    if (!v) return
    const newTodo = { id: Date.now(), text: v, done: false }
    setTodos((s) => [newTodo, ...s])
    setText('')
    inputRef.current?.focus()
  }

  function toggleDone(id) {
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function removeTodo(id) {
    setTodos((s) => s.filter((t) => t.id !== id))
  }

  function startEdit(id) {
    setEditingId(id)
  }

  function saveEdit(id, newText) {
    const v = (newText || '').trim()
    if (!v) return setEditingId(null)
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, text: v } : t)))
    setEditingId(null)
  }

  function clearCompleted() {
    setTodos((s) => s.filter((t) => !t.done))
  }

  return (
    <div className="app-root">
      <header className="header">
        <h1>Meu Tudo List</h1>
        <p className="subtitle">Simple, friendly and responsive</p>
      </header>

      <main className="container">
        <form className="todo-form" onSubmit={addTodo}>
          <input
            ref={inputRef}
            className="todo-input"
            placeholder="Add a task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="New todo"
          />
          <button className="btn add" type="submit">
            Add
          </button>
        </form>

        <div className="controls">
          <div className="count">{todos.length} items</div>
          <div className="actions">
            <button className="btn small" onClick={clearCompleted} type="button">
              Clear completed
            </button>
          </div>
        </div>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
              <div className="left">
                <input
                  id={`ch-${todo.id}`}
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleDone(todo.id)}
                />
              </div>

              <div className="content">
                {editingId === todo.id ? (
                  <input
                    className="edit-input"
                    defaultValue={todo.text}
                    onBlur={(e) => saveEdit(todo.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.currentTarget.blur()
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    autoFocus
                  />
                ) : (
                  <label htmlFor={`ch-${todo.id}`} className="text" onDoubleClick={() => startEdit(todo.id)}>
                    {todo.text}
                  </label>
                )}
              </div>

              <div className="right">
                <button className="btn small" onClick={() => startEdit(todo.id)} aria-label="Edit">
                  Edit
                </button>
                <button className="btn danger small" onClick={() => removeTodo(todo.id)} aria-label="Delete">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="footer">Tip: double-click a task or press Edit to change it.</footer>
    </div>
  )
}

export default App
