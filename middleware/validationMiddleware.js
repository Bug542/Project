export function cleanText(value) {
  return String(value || '').trim();
}

export function requireFields(fields) {
  return (req, res, next) => {
    for (const field of fields) {
      if (!cleanText(req.body[field])) {
        req.session.error = 'Please complete all required fields.';
        return res.redirect('back');
      }
    }
    next();
  };
}
