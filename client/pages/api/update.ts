import { Handler } from 'next-iron-session';
import { withSession } from '../../utils';

const handler: Handler = async (req, res) => {
  const { body } = await req;

  // get user from database then:
  req.session.set('user', body);
  await req.session.save();
  res.send({ isLoggedIn: true, ...body });
};

export default withSession(handler);
