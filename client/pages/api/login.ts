import { Handler } from 'next-iron-session';
import { urlApi, withSession } from 'utils';

const handler: Handler = async (req, res) => {
  const { username, password } = await req.body;

  const response = await fetch(urlApi + '/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (response.status === 401) {
    res.status(401).send({ isLoggedIn: false });
    return;
  }

  // get user from database then:
  req.session.set('user', data.data);
  await req.session.save();
  res.send({ isLoggedIn: true, ...data.data });
};

export default withSession(handler);
