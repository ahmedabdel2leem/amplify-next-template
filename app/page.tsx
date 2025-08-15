"use client";

import { useState, useEffect, use } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import TodoItem from '@/components/TodoItem';
import { motion } from "framer-motion";
import SubscriptionManager from "@/components/SubscriptionForm";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const [category, setCategory] = useState("personal");
  const categories = ["personal", "work", "all"];
  const [filterCategory, setFilterCategory] = useState("all");
 function listTodosByCategory(category: string) {
  setLoading(true);
  if (filterCategory === "all") {
    listTodos();
    return;
  }
  client.models.Todo.observeQuery({
    filter: { category: { eq: filterCategory } },
  }).subscribe({
    next: (data) => {
      setTodos([...data.items]);
      setLoading(false);
    },
  });
}

function listTodos() {
  setLoading(true);
  client.models.Todo.observeQuery().subscribe({
    next: (data) => {
      setTodos([...data.items]);
      setLoading(false);
    },
  });
}

  useEffect(() => {
    listTodosByCategory(filterCategory);
  }, [filterCategory]);

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    if (inputValue.trim() === "") return;
    client.models.Todo.create({
      content: inputValue,
      category: category,
    });
  }
  async function deleteTodo(id: string) {
    try {
      await client.models.Todo.delete({ id });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  async function toggleTodo(id: string, isDone: boolean) {
    try {
      await client.models.Todo.update({ id, isDone: !isDone });
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  }

  const { user, signOut } = useAuthenticator();
  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <h1>My todos</h1>
      <input className="block w-full px-4 py-2 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
     <div className="relative w-full ">
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="block w-full px-4 py-2 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
  >
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat.charAt(0).toUpperCase() + cat.slice(1)}
      </option>
    ))}
  </select>
  {/* Custom arrow */}
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>
      <button onClick={createTodo}>+ new</button>
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
        <option value="personal">Personal</option>
        <option value="work">Work</option>
        <option value="all">All</option>
      </select>
    {loading ? (
  <div className="space-y-3 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-200 rounded"></div>
    ))}
  </div>
) : (
  <div>
    <motion.ul className="p-0 bg-transparent">
      {todos.map((todo, index) => (
        
      <TodoItem
        key={todo.id}
        index={index}
        todo={todo}
        onDelete={deleteTodo}
        onToggle={toggleTodo}
      />
    ))}
  </motion.ul>
  </div>
)}
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
      <SubscriptionManager />
    </main>
  );
}
