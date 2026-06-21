import { getVehicles, getCategories, updateVehicle } from '../models/vehicleModel.js';
import { getAllReviews, deleteReview } from '../models/reviewModel.js';
import { getAllServiceRequests, updateServiceRequest } from '../models/serviceModel.js';
import { getAllMessages, updateMessageStatus } from '../models/messageModel.js';
import { cleanText } from '../middleware/validationMiddleware.js';

export function dashboard(req, res) { res.render('employee/dashboard', { title: 'Employee Dashboard' }); }
export async function vehicles(req, res, next) { try { res.render('employee/vehicles', { title: 'Manage Vehicles', vehicles: await getVehicles(), categories: await getCategories() }); } catch (err) { next(err); } }
export async function saveVehicle(req, res, next) { try { await updateVehicle(req.params.id, normalizeVehicle(req.body)); req.session.success='Vehicle updated.'; res.redirect('/employee/vehicles'); } catch (err) { next(err); } }
export async function reviews(req, res, next) { try { res.render('employee/reviews', { title: 'Moderate Reviews', reviews: await getAllReviews() }); } catch (err) { next(err); } }
export async function removeReview(req, res, next) { try { await deleteReview(req.params.id); req.session.success='Review removed.'; res.redirect('/employee/reviews'); } catch (err) { next(err); } }
export async function services(req, res, next) { try { res.render('employee/services', { title: 'Service Requests', requests: await getAllServiceRequests() }); } catch (err) { next(err); } }
export async function updateService(req, res, next) { try { await updateServiceRequest(req.params.id, req.body.status, cleanText(req.body.notes)); req.session.success='Service request updated.'; res.redirect('/employee/service-requests'); } catch (err) { next(err); } }
export async function messages(req, res, next) { try { res.render('employee/messages', { title: 'Contact Messages', messages: await getAllMessages() }); } catch (err) { next(err); } }
export async function updateMessage(req, res, next) { try { await updateMessageStatus(req.params.id, req.body.status); res.redirect('/employee/messages'); } catch (err) { next(err); } }

function normalizeVehicle(body) {
  return { categoryId: body.categoryId, make: cleanText(body.make), model: cleanText(body.model), year: Number(body.year), mileage: Number(body.mileage), price: Number(body.price), description: cleanText(body.description), availability: cleanText(body.availability) };
}
