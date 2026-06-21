export function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.error = 'Please log in first.';
    return res.redirect('/login');
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.role)) {
      req.session.error = 'You do not have permission to view that page.';
      return res.redirect('/');
    }
    next();
  };
}
