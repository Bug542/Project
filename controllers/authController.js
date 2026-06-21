import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../models/userModel.js';
import { cleanText } from '../middleware/validationMiddleware.js';

export function showLogin(req, res) { res.render('auth/login', { title: 'Login' }); }
export function showRegister(req, res) { res.render('auth/register', { title: 'Register' }); }

export async function register(req, res, next) {
  try {
    const firstName = cleanText(req.body.firstName);
    const lastName = cleanText(req.body.lastName);
    const email = cleanText(req.body.email).toLowerCase();
    const password = cleanText(req.body.password);
    if (!firstName || !lastName || !email || password.length < 8) {
      req.session.error = 'Please enter valid information. Password must be at least 8 characters.';
      return res.redirect('/register');
    }
    if (await findUserByEmail(email)) {
      req.session.error = 'That email is already registered.';
      return res.redirect('/register');
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({ firstName, lastName, email, passwordHash });
    req.session.user = user;
    res.redirect('/account');
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const email = cleanText(req.body.email).toLowerCase();
    const password = cleanText(req.body.password);
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      req.session.error = 'Invalid email or password.';
      return res.redirect('/login');
    }
    req.session.user = { user_id: user.user_id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role };
    if (user.role === 'owner') return res.redirect('/admin');
    if (user.role === 'employee') return res.redirect('/employee');
    res.redirect('/account');
  } catch (err) { next(err); }
}

export function logout(req, res) { req.session.destroy(() => res.redirect('/')); }
