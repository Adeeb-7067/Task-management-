import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { TaskForm } from './components/Tasks/TaskForm';
import { TaskBoard } from './components/Tasks/TaskBoard';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { Task, NewTask } from './types';

function App() {
  const { user, login, register, logout } = useAuth();
  const { tasks, filter, setFilter, addTask: addTaskToList, updateTask, deleteTask: deleteTaskFromList } = useTasks(user?.token || '');

  const addTask = async (taskData: NewTask) => {
    await addTaskToList(taskData);
  };

  const handleDelete = async (taskId: string) => {
    try {
      if (!taskId) {
        console.error('Invalid task ID');
        return;
      }
      await deleteTaskFromList(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleStatus = async (taskId: string) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) {
        console.error('Task not found:', taskId);
        return;
      }
      await updateTask(taskId, {
        status: task.status === 'complete' ? 'incomplete' : 'complete'
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  if (!user) {
    return (
      <Router>
        <Container component="main" maxWidth="xs">
          <Routes>
            <Route path="/login" element={<LoginForm onSubmit={login} />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Container>
      </Router>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Management
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <TaskForm
          onSubmit={async (taskData) => {
            await addTask(taskData);
          }}
        />
        <TaskBoard
          tasks={tasks}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </Container>
    </Box>
  );
}

export default App;
