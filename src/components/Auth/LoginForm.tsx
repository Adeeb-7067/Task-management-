import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, TextField, Button, Typography , Link } from '@mui/material';

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<any>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values.email, values.password);
      } catch (error) {
        formik.setErrors({ email: 'Invalid credentials' });
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Login
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      <TextField
        fullWidth
        margin="normal"
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Login
      </Button>
      <Typography variant="body2" color="text.secondary">
        Don't have an account? <Link href="/register" variant="body2" color="primary">Register</Link>
      </Typography>
    </Box>
  );
};
