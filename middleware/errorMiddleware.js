export function notFound(req, res) {
  res.status(404).render('error', { title: 'Page Not Found', message: 'The page you requested could not be found.' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).render('error', { title: 'Server Error', message: 'Something went wrong. Please try again later.' });
}
