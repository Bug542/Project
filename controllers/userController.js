import { getVehicles } from '../models/vehicleModel.js';
import { getUserReviews, updateReview, deleteReview } from '../models/reviewModel.js';
import { createServiceRequest, getUserServiceRequests } from '../models/serviceModel.js';
import { cleanText } from '../middleware/validationMiddleware.js';

export function dashboard(req, res) { res.render('user/dashboard', { title: 'My Account' }); }

export async function reviews(req, res, next) {
  try { res.render('user/reviews', { title: 'My Reviews', reviews: await getUserReviews(req.session.user.user_id) }); }
  catch (err) { next(err); }
}

export async function editReview(req, res, next) {
  try {
    await updateReview(req.params.id, req.session.user.user_id, Number(req.body.rating), cleanText(req.body.reviewText));
    req.session.success = 'Review updated.';
    res.redirect('/account/reviews');
  } catch (err) { next(err); }
}

export async function removeReview(req, res, next) {
  try { await deleteReview(req.params.id, req.session.user.user_id); req.session.success = 'Review deleted.'; res.redirect('/account/reviews'); }
  catch (err) { next(err); }
}

export async function serviceForm(req, res, next) {
  try { res.render('user/service-form', { title: 'New Service Request', vehicles: await getVehicles() }); }
  catch (err) { next(err); }
}

export async function submitService(req, res, next) {
  try {
    const serviceType = cleanText(req.body.serviceType);
    const description = cleanText(req.body.description);
    if (!serviceType || !description) {
      req.session.error = 'Please complete the service request.';
      return res.redirect('/account/service-requests/new');
    }
    await createServiceRequest({ userId: req.session.user.user_id, vehicleId: req.body.vehicleId, serviceType, description });
    req.session.success = 'Service request submitted.';
    res.redirect('/account/service-requests');
  } catch (err) { next(err); }
}

export async function serviceHistory(req, res, next) {
  try { res.render('user/service-history', { title: 'Service History', requests: await getUserServiceRequests(req.session.user.user_id) }); }
  catch (err) { next(err); }
}
