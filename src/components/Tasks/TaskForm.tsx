import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { NewTask, Task } from '../../types';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be at most 200 characters'),
  priority: yup
    .string()
    .oneOf(['Low', 'Medium', 'High'], 'Invalid priority')
    .required('Priority is required'),
});

interface TaskFormProps {
  onSubmit: (task: NewTask) => Promise<void>;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      priority: 'Medium' as const,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit(values);
        resetForm();
      } catch (error) {
        console.error('Failed to add task:', error);
      }
    },
  });

  return (
    <Paper
      component={motion.form}
      onSubmit={formik.handleSubmit}
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
        Create New Task
      </Typography>

      <TextField
        fullWidth
        id="title"
        name="title"
        label="Title"
        placeholder="Enter a clear and concise title"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
            },
            '&.Mui-focused': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          },
        }}
      />

      <TextField
        fullWidth
        id="description"
        name="description"
        label="Description"
        placeholder="Provide detailed information about the task"
        multiline
        rows={4}
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
            },
            '&.Mui-focused': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          },
        }}
      />

      <FormControl
        fullWidth
        error={formik.touched.priority && Boolean(formik.errors.priority)}
        sx={{ mb: 3 }}
      >
        <InputLabel id="priority-label">Priority Level</InputLabel>
        <Select
          labelId="priority-label"
          id="priority"
          name="priority"
          value={formik.values.priority}
          label="Priority Level"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              transition: 'all 0.3s ease',
            },
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
            },
            '&.Mui-focused': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
        >
          <MenuItem value="Low" sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                  mr: 1,
                }}
              />
              Low Priority
            </Box>
          </MenuItem>
          <MenuItem value="Medium" sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.warning.main,
                  mr: 1,
                }}
              />
              Medium Priority
            </Box>
          </MenuItem>
          <MenuItem value="High" sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.error.main,
                  mr: 1,
                }}
              />
              High Priority
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<AddIcon />}
        sx={{
          mt: 3,
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          },
        }}
      >
        Create Task
      </Button>
    </Paper>
  );
};
