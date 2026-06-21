import { getAllUsers, updateUserRole } from '../models/userModel.js';
import { getVehicles, getCategories, createVehicle, deleteVehicle, createCategory, deleteCategory, addVehicleImage } from '../models/vehicleModel.js';
import { getAllReviews } from '../models/reviewModel.js';
import { getAllServiceRequests } from '../models/serviceModel.js';
import { cleanText } from '../middleware/validationMiddleware.js';

export async function dashboard(req, res, next) {
  try { res.render('admin/dashboard', { title: 'Owner Dashboard', users: await getAllUsers(), vehicles: await getVehicles(), reviews: await getAllReviews(), requests: await getAllServiceRequests() }); }
  catch (err) { next(err); }
}
export async function users(req, res, next) { try { res.render('admin/users', { title: 'Manage Users', users: await getAllUsers() }); } catch (err) { next(err); } }
export async function saveUserRole(req, res, next) { try { await updateUserRole(req.params.id, req.body.role); res.redirect('/admin/users'); } catch (err) { next(err); } }
export async function vehicles(req, res, next) { try { res.render('admin/vehicles', { title: 'Inventory', vehicles: await getVehicles(), categories: await getCategories() }); } catch (err) { next(err); } }
export async function addVehicle(req, res, next) { try { const vehicle = await createVehicle(normalizeVehicle(req.body)); if (cleanText(req.body.imageUrl)) await addVehicleImage(vehicle.vehicle_id, cleanText(req.body.imageUrl), true); res.redirect('/admin/vehicles'); } catch (err) { next(err); } }
export async function removeVehicle(req, res, next) { try { await deleteVehicle(req.params.id); res.redirect('/admin/vehicles'); } catch (err) { next(err); } }
export async function categories(req, res, next) { try { res.render('admin/categories', { title: 'Categories', categories: await getCategories() }); } catch (err) { next(err); } }
export async function addCategory(req, res, next) { try { await createCategory(cleanText(req.body.categoryName)); res.redirect('/admin/categories'); } catch (err) { next(err); } }
export async function removeCategory(req, res, next) { try { await deleteCategory(req.params.id); res.redirect('/admin/categories'); } catch (err) { next(err); } }

function normalizeVehicle(body) {
  return { categoryId: body.categoryId, make: cleanText(body.make), model: cleanText(body.model), year: Number(body.year), mileage: Number(body.mileage), price: Number(body.price), description: cleanText(body.description), availability: cleanText(body.availability || 'Available') };
}
