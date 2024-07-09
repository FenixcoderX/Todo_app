import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToDo from './ToDo';

describe('ToDo Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('allows users to add a task', () => {
    render(<ToDo />);
    fireEvent.change(screen.getByPlaceholderText(/add a new task/i), {
      target: { value: 'New Task' },
    });
    fireEvent.click(screen.getByText(/add task/i));
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  test('allows users to delete a task', async () => {
    render(<ToDo />);
    fireEvent.change(screen.getByPlaceholderText(/add a new task/i), {
      target: { value: 'Task to be deleted' },
    });
    fireEvent.click(screen.getByText(/add task/i));
    expect(screen.getByText('Task to be deleted')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/delete task/i));

    await waitFor(() => {
      expect(screen.queryByText('Task to be deleted')).not.toBeInTheDocument();
    });
  });

  test('allows users to toggle task completion', () => {
    render(<ToDo />);
    fireEvent.change(screen.getByPlaceholderText(/add a new task/i), {
      target: { value: 'New Task' },
    });
    fireEvent.click(screen.getByText(/add task/i));
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('allows users to filter tasks', () => {
    render(<ToDo />);
    fireEvent.change(screen.getByPlaceholderText(/add a new task/i), {
      target: { value: 'Active Task' },
    });
    fireEvent.click(screen.getByText(/add task/i));
    fireEvent.change(screen.getByPlaceholderText(/add a new task/i), {
      target: { value: 'Completed Task' },
    });
    fireEvent.click(screen.getByText(/add task/i));
    fireEvent.click(screen.getAllByRole('checkbox')[1]);
    const completedFilterButton = screen
      .getAllByRole('button', { name: /completed/i })
      .find((button) => button.textContent === 'Completed') as HTMLElement;
    fireEvent.click(completedFilterButton);
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
    expect(screen.queryByText('Active Task')).not.toBeInTheDocument();
  });

  test('allows users to clear completed tasks', () => {
    render(<ToDo />);
    fireEvent.change(screen.getByPlaceholderText(/add a new task/i), {
      target: { value: 'Completed Task' },
    });
    fireEvent.click(screen.getByText(/add task/i));
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByText(/clear completed/i));
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
  });
});
