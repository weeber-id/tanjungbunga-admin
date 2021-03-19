import { Handler } from 'next-iron-session';
import { withSession } from '../../utils';

const handler: Handler = async (req, res) => {
  req.session.destroy();
  res.json({ isLoggedIn: false });
};

export default withSession(handler);
