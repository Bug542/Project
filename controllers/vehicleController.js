import { getFeaturedVehicles, getVehicles, getVehicleById, getVehicleImages, getCategories } from '../models/vehicleModel.js';
import { getReviewsForVehicle, createReview } from '../models/reviewModel.js';
import { createMessage } from '../models/messageModel.js';
import { cleanText } from '../middleware/validationMiddleware.js';

export async function home(req, res, next) {
  try { res.render('index', { title: 'Home', vehicles: await getFeaturedVehicles() }); }
  catch (err) { next(err); }
}

export async function listVehicles(req, res, next) {
  try {
    res.render('vehicles/list', { title: 'Browse Vehicles', vehicles: await getVehicles(req.query.category), categories: await getCategories(), selectedCategory: req.query.category || '' });
  } catch (err) { next(err); }
}

export async function vehicleDetail(req, res, next) {
  try {
    const vehicle = await getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).render('error', { title: 'Not Found', message: 'Vehicle not found.' });
    res.render('vehicles/detail', { title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`, vehicle, images: await getVehicleImages(req.params.id), reviews: await getReviewsForVehicle(req.params.id) });
  } catch (err) { next(err); }
}

export async function addReview(req, res, next) {
  try {
    const rating = Number(req.body.rating);
    const text = cleanText(req.body.reviewText);
    if (!text || rating < 1 || rating > 5) {
      req.session.error = 'Please enter a rating and review text.';
      return res.redirect(`/vehicles/${req.params.id}`);
    }
    await createReview(req.session.user.user_id, req.params.id, rating, text);
    req.session.success = 'Review added.';
    res.redirect(`/vehicles/${req.params.id}`);
  } catch (err) { next(err); }
}

export function contactPage(req, res) { res.render('contact', { title: 'Contact Us' }); }

export async function submitContact(req, res, next) {
  try {
    const data = { name: cleanText(req.body.name), email: cleanText(req.body.email), subject: cleanText(req.body.subject), message: cleanText(req.body.message) };
    if (!data.name || !data.email || !data.message) {
      req.session.error = 'Please complete the contact form.';
      return res.redirect('/contact');
    }
    await createMessage(data);
    req.session.success = 'Your message was sent.';
    res.redirect('/contact');
  } catch (err) { next(err); }
}
