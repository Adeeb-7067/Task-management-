import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Chip,
  Box,
  Paper,
  Typography,
  ButtonGroup,
  Button,
  Fade,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

const getPriorityColor = (priority: Task['priority'], theme: any) => {
  switch (priority) {
    case 'High':
      return {
        bg: alpha(theme.palette.error.main, 0.1),
        color: theme.palette.error.main,
        border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
      };
    case 'Medium':
      return {
        bg: alpha(theme.palette.warning.main, 0.1),
        color: theme.palette.warning.main,
        border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`
      };
    case 'Low':
      return {
        bg: alpha(theme.palette.success.main, 0.1),
        color: theme.palette.success.main,
        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
      };
    default:
      return {
        bg: theme.palette.grey[100],
        color: theme.palette.text.secondary,
        border: `1px solid ${theme.palette.grey[300]}`
      };
  }
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleStatus,
  onDelete,
  filter,
  onFilterChange,
}) => {
  const theme = useTheme();
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const completedTasks = tasks.filter(task => task.status === 'complete').length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const handleToggleStatus = async (taskId: string) => {
    setLoading(prev => ({ ...prev, [taskId]: true }));
    try {
      await onToggleStatus(taskId);
    } finally {
      setLoading(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const handleDelete = async (taskId: string) => {
    setLoading(prev => ({ ...prev, [taskId]: true }));
    try {
      await onDelete(taskId);
    } finally {
      setLoading(prev => ({ ...prev, [taskId]: false }));
    }
  };
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssignmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" component="span" color="primary">
            Task Progress
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: theme.palette.primary.main,
              }
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute', 
              right: 0, 
              top: -20,
              color: theme.palette.text.secondary
            }}
          >
            {Math.round(progress)}% Complete
          </Typography>
        </Box>
      </Box>

      <ButtonGroup 
        variant="outlined" 
        sx={{ 
          mb: 3, 
          display: 'flex', 
          justifyContent: 'center',
          '& .MuiButton-root': {
            px: 4,
            py: 1,
            borderRadius: '28px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[2],
            }
          }
        }}
      >
        <Button 
          onClick={() => onFilterChange('all')}
          variant={filter === 'all' ? 'contained' : 'outlined'}
          sx={{
            backgroundColor: filter === 'all' ? theme.palette.primary.main : 'transparent',
          }}
        >
          All Tasks
        </Button>
        <Button 
          onClick={() => onFilterChange('active')}
          variant={filter === 'active' ? 'contained' : 'outlined'}
          sx={{
            backgroundColor: filter === 'active' ? theme.palette.primary.main : 'transparent',
          }}
        >
          In Progress
        </Button>
        <Button 
          onClick={() => onFilterChange('completed')}
          variant={filter === 'completed' ? 'contained' : 'outlined'}
          sx={{
            backgroundColor: filter === 'completed' ? theme.palette.primary.main : 'transparent',
          }}
        >
          Completed
        </Button>
      </ButtonGroup>

      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <List sx={{ p: 0 }}>
          <AnimatePresence>
            {tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <AssignmentIcon sx={{ fontSize: 48, color: theme.palette.action.disabled, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No tasks found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add a new task to get started
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              tasks.map((task) => (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ListItem
                    onMouseEnter={() => setHoveredTask(task._id)}
                    onMouseLeave={() => setHoveredTask(null)}
                    sx={{
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease',
                      backgroundColor: hoveredTask === task._id ? alpha(theme.palette.primary.main, 0.02) : 'transparent',
                      opacity: loading[task._id] ? 0.7 : 1,
                      pointerEvents: loading[task._id] ? 'none' : 'auto',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    <Checkbox
                      edge="start"
                      checked={task.status === 'complete'}
                      onChange={() => handleToggleStatus(task._id)}
                      disabled={loading[task._id]}
                      icon={<StarBorderIcon />}
                      checkedIcon={<StarIcon />}
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    />
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          component="span"
                          sx={{
                            textDecoration: task.status === 'complete' ? 'line-through' : 'none',
                            color: task.status === 'complete' ? theme.palette.text.secondary : theme.palette.text.primary,
                            fontWeight: 500,
                          }}
                        >
                          {task.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: theme.palette.text.secondary,
                              mb: 1,
                              opacity: task.status === 'complete' ? 0.7 : 1,
                            }}
                          >
                            {task.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={task.priority}
                              size="small"
                              sx={{
                                ...getPriorityColor(task.priority, theme),
                                fontWeight: 500,
                                borderRadius: '16px',
                              }}
                            />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: theme.palette.text.secondary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <Fade in={hoveredTask === task._id}>
                      <IconButton 
                        edge="end" 
                        onClick={() => handleDelete(task._id)}
                        disabled={loading[task._id]}
                        sx={{
                          color: theme.palette.error.main,
                          opacity: 0.7,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            opacity: 1,
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Fade>
                  </ListItem>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </List>
      </Paper>
    </Box>
  );
};
