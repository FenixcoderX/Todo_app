import { useState, useEffect } from 'react';
import { GoTrash } from 'react-icons/go';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = 'all' | 'active' | 'completed';

const Todo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  // Download tasks from localStorage when the component is mounted
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage when tasks change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  /**
   * Adds a new task to the list of tasks
   */
  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  /**
   * Toggles the completion status of a task
   * @param {number} taskId - The ID of the task to toggle
   */
  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /**
   * Deletes a task from the list of tasks
   * @param {number} taskId - The ID of the task to be deleted
   */
  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  /**
   * Clears the completed tasks from the task list
   */
  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  /**
   * Filters the tasks based on the selected filter
   * @returns An array of tasks that match the selected filter
   */
  const filteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter((task) => !task.completed);
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'all':
      default:
        return tasks;
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg rounded-lg p-5 sm:max-w-xl md:max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-4 text-white">Todo</h1>
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task"
          className="form-input px-4 py-2 rounded border-transparent focus:border-transparent focus:ring-0 focus:outline-none mb-4 sm:mb-0 sm:flex-grow"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Add Task
        </button>
      </div>
      <div className="flex flex-col items-center  sm:flex-row justify-between mb-4">
        <div className="flex justify-center i gap-4 mb-4 sm:mb-0">
          <button
            onClick={() => setFilter('all')}
            className="bg-gray-300 text-gray-800 border-2 border-transparent hover:border-2 hover:border-inherit text-xs font-bold px-2 rounded"
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className="bg-blue-300 text-blue-800 border-2 border-transparent hover:border-2 hover:border-inherit text-xs font-bold px-2 rounded"
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className="bg-green-300 text-green-800 border-2 border-transparent hover:border-2 hover:border-inherit text-xs font-bold px-2 rounded"
          >
            Completed
          </button>
        </div>
        <button
          onClick={clearCompletedTasks}
          className="bg-purple-500 hover:bg-purple-700 text-white text-xs font-bold px-4 rounded w-36"
        >
          Clear Completed
        </button>
      </div>
      <ul>
        {filteredTasks().map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-2"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
              className="form-checkbox h-5 w-5"
            />
            <span
              className={`${
                task.completed ? 'line-through' : ''
              } flex-grow ml-4 mr-2`}
            >
              {task.text}
            </span>
            <button
              aria-label="Delete task"
              onClick={() => deleteTask(task.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mx-auto"
            >
              <GoTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
