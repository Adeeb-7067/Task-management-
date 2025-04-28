import React, { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  alpha,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { Task } from '../../types';
import { format } from 'date-fns';
import { motion, AnimatePresence, HTMLMotionProps, ForwardRefComponent } from 'framer-motion';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

type MotionDivProps = React.ComponentProps<typeof motion.div>;

interface DraggableMotionProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const DraggableMotion = React.forwardRef<HTMLDivElement, DraggableMotionProps>(
  ({ provided, snapshot, children, style, ...props }, ref) => {
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          ...provided.draggableProps.style,
          ...style
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

interface TaskBoardProps {
  tasks: Task[];
  onToggleStatus: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

interface Column {
  id: 'incomplete' | 'complete';
  title: string;
  tasks: Task[];
}

const getPriorityColor = (priority: Task['priority'], theme: any) => {
  switch (priority) {
    case 'High':
      return {
        bg: alpha(theme.palette.error.main, 0.1),
        color: theme.palette.error.main,
        border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
      };
    case 'Medium':
      return {
        bg: alpha(theme.palette.warning.main, 0.1),
        color: theme.palette.warning.main,
        border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
      };
    case 'Low':
      return {
        bg: alpha(theme.palette.success.main, 0.1),
        color: theme.palette.success.main,
        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
      };
    default:
      return {
        bg: theme.palette.grey[100],
        color: theme.palette.text.secondary,
        border: `1px solid ${theme.palette.grey[300]}`,
      };
  }
};

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onToggleStatus,
  onDelete,
}) => {
  const theme = useTheme();

  const columns: Column[] = useMemo(() => [
    {
      id: 'incomplete',
      title: 'To Do',
      tasks: tasks.filter((task) => task.status === 'incomplete'),
    },
    {
      id: 'complete',
      title: 'Completed',
      tasks: tasks.filter((task) => task.status === 'complete'),
    },
  ], [tasks]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId !== source.droppableId &&
      (destination.droppableId === 'complete' || destination.droppableId === 'incomplete')
    ) {
      const taskToUpdate = tasks.find(task => task._id === draggableId);
      if (taskToUpdate) {
        onToggleStatus(draggableId);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mt: 2,
        }}
      >
        {columns.map((column) => (
          <Paper
            key={column.id}
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                pb: 1,
              }}
            >
              {column.title}
            </Typography>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    minHeight: 100,
                    backgroundColor: snapshot.isDraggingOver
                      ? alpha(theme.palette.primary.main, 0.05)
                      : 'transparent',
                    transition: 'background-color 0.2s ease',
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  <AnimatePresence>
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <DraggableMotion
                            provided={provided}
                            snapshot={snapshot}
                          >
                            <motion.div
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              style={{
                                ...provided.draggableProps.style,
                                backgroundColor: snapshot.isDragging
                                  ? alpha(theme.palette.background.paper, 0.9)
                                  : theme.palette.background.paper,
                                boxShadow: theme.shadows[snapshot.isDragging ? 8 : 1],
                                padding: theme.spacing(2),
                                marginBottom: theme.spacing(2),
                                transition: 'all 0.3s ease',
                                borderRadius: theme.shape.borderRadius,
                                transform: snapshot.isDragging ? 'scale(1.02)' : 'none'
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                  {task.title}
                                </Typography>
                                <Box>
                                  <IconButton
                                    size="small"
                                    onClick={() => onToggleStatus(task._id)}
                                    sx={{
                                      color: theme.palette.primary.main,
                                      mr: 1,
                                    }}
                                  >
                                    {task.status === 'complete' ? <StarIcon /> : <StarBorderIcon />}
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => onDelete(task._id)}
                                    sx={{
                                      color: theme.palette.error.main,
                                      '&:hover': {
                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                      },
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
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
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
                                </Typography>
                              </Box>
                            </motion.div>
                          </DraggableMotion>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Paper>
        ))}
      </Box>
    </DragDropContext>
  );
};
