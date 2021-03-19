import { Button, Sidebar, Textfield } from 'components';
import { useUser } from 'hooks';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { urlApi } from 'utils/urlApi';

const LoginPage = () => {
  const { mutateUser } = useUser({
    redirectIfFound: true,
    redirectTo: '/',
  });

  const router = useRouter();

  const [state, setState] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // set iron session
    const res = await fetch('/api-client/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });

    await mutateUser(await res.json());

    // for set cookie from backend api
    const response = await fetch(urlApi + '/login', {
      method: 'POST',
      body: JSON.stringify(state),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    await response.json();

    if (res.ok) {
      router.replace('/');
    }
  };

  return (
    <div className="grid grid-cols-page h-screen">
      <Sidebar />
      <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col px-4">
          <Textfield
            fullWidth
            className="mb-3"
            labelText="Username"
            labelTextColor="purple-light"
            placeholder="Jane Doe"
            onChange={handleChange}
            name="username"
            value={state.username}
            autoComplete="off"
          />
          <Textfield
            fullWidth
            className="mb-6"
            labelText="Password"
            labelTextColor="purple-light"
            type="password"
            onChange={handleChange}
            name="password"
            value={state.password}
            autoComplete="off"
          />
          <div className="grid grid-cols-2 gap-4">
            <Button type="submit">Login</Button>
            <Button href="/register" variant="outlined" color="red">
              Daftar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
