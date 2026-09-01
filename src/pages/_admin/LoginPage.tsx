import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { brand } from '@/lib/brand';
import { ROUTING } from '@/lib/routing';
import { sessionFromResponse } from '@/lib/auth/session';
import { sessionStarted } from '@/store/authSlice';
import { loginErrorMessage, useLoginMutation } from '@/lib/redux/api/auth-api/auth-api-slice';
import { ThemeProvider } from '@/layout/admin-layout/theme-context';
import Button from '@/components/_admin/ui/Button';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Input from '@/components/_admin/forms/Input';

type LoginFormValuesType = {
  username: string;
  password: string;
};

/** Same character set the main frontend allows for a login identifier. */
const USERNAME_PATTERN = /^[A-Za-z0-9._@+-]+$/;

function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValuesType>({ defaultValues: { username: '', password: '' } });

  const from = (location.state as { from?: string } | null)?.from ?? ROUTING.admin;

  const onSubmit = async (values: LoginFormValuesType) => {
    setFormError(null);
    try {
      const response = await login({
        username: values.username.trim(),
        password: values.password,
      }).unwrap();

      const session = sessionFromResponse(response);
      if (!session) {
        setFormError('Sign in failed. Please try again.');
        return;
      }
      dispatch(sessionStarted(session));
      navigate(from, { replace: true });
    } catch (error) {
      setFormError(loginErrorMessage(error));
    }
  };

  return (
    <div className="admin @container flex min-h-dvh items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[380px]">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-card bg-accent text-lg font-bold text-white">
            {brand.name.slice(0, 1)}
          </div>
          <p className="text-[15px] font-semibold text-ink">{brand.name} Admin</p>
          <p className="text-[13px] text-ink-3">Sign in to manage your brand page.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5"
        >
          <FormGroup label="Username or email" full>
            <Input
              type="text"
              autoComplete="username"
              autoFocus
              placeholder="Enter your username or email"
              aria-invalid={!!errors.username}
              {...register('username', {
                required: 'Enter your username or email.',
                minLength: { value: 4, message: 'Username must be at least 4 characters.' },
                maxLength: { value: 255, message: 'Username is too long.' },
                pattern: { value: USERNAME_PATTERN, message: 'That is not a valid username or email.' },
              })}
            />
            {errors.username && <p className="mt-1 text-[11px] text-red">{errors.username.message}</p>}
          </FormGroup>

          <FormGroup label="Password" full>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              {...register('password', { required: 'Enter your password.' })}
            />
            {errors.password && <p className="mt-1 text-[11px] text-red">{errors.password.message}</p>}
          </FormGroup>

          {formError && <p className="text-[11px] text-red">{formError}</p>}

          <Button type="submit" loading={isLoading} className="w-full justify-center">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const status = useAppSelector((state) => state.auth.status);

  // Already signed in, so skip the form entirely.
  if (status === 'authenticated') return <Navigate to={ROUTING.admin} replace />;

  return (
    <ThemeProvider>
      <LoginForm />
    </ThemeProvider>
  );
}
