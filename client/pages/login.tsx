import { Button, SidebarLogin, Textfield } from 'components';
import { useMedia, useUser } from 'hooks';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { urlApi } from 'utils/urlApi';

const LoginPage = () => {
  const { mutateUser } = useUser({
    redirectIfFound: true,
    redirectTo: '/',
  });

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const [state, setState] = useState({
    username: '',
    password: '',
  });

  const isMobile = useMedia({ query: '(max-width: 640px)' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = useMutation(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // set iron session
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      // for set cookie from backend api
      await fetch(urlApi + '/login', {
        method: 'POST',
        body: JSON.stringify(state),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      return res;
    },
    {
      onSuccess: async (data) => {
        await mutateUser(await data.json());
        setLoading(true);
        router.replace('/');
      },
    }
  );

  return (
    <div className="sm:grid grid-cols-page h-screen">
      {!isMobile && <SidebarLogin />}
      <div className="flex justify-center items-center sm:h-auto h-screen">
        <form
          onSubmit={(e) => handleSubmit.mutate(e)}
          className="w-full max-w-xs flex flex-col px-4"
        >
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
            <Button isLoading={handleSubmit.isLoading || loading} type="submit">
              Login
            </Button>
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
