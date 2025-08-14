import { useState } from 'react';
import type { Schema } from "@/amplify/data/resource";

interface TodoItemProps {
  todo: Schema["Todo"]["type"];
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, isDone: boolean) => Promise<void>;
}

export default function TodoItem({ todo, onDelete, onToggle }: TodoItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete(todo.id);
    setIsLoading(false);
  };

  const handleToggle = async () => {
    setIsLoading(true);
    await onToggle(todo.id, todo?.isDone || false);
    setIsLoading(false);
  };

  return (
    <li className={`flex items-center justify-between ${todo.isDone ? "!bg-gray-200" : "bg-white"}`}>
      <span>
        <strong>{todo.content}</strong>
      </span>
      <div className="!flex items-center gap-2">
        <span onClick={handleToggle}>
          <span className={`cursor-pointer p-2 bg-black ${todo.isDone ? "text-green-500" : "text-red-500"}`}>
            {isLoading ? "⏳" : todo.isDone ? "✔️" : "❌"}
          </span>
        </span>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </li>
  );
}
