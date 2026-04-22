import { Router, Request, Response, NextFunction } from 'express';
import { restaurantModel } from '../models/restaurant.js';
import { ApiResponse, CreateRestaurantDTO } from '../models/types.js';

const router = Router();

router.get('/', async (_req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const restaurants = await restaurantModel.findAll();
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ success: false, error: 'Error fetching restaurants' });
  }
});

router.get('/:id', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const id = parseInt(req.params.id);
    const restaurant = await restaurantModel.findById(id);
    
    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }
    
    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ success: false, error: 'Error fetching restaurant' });
  }
});

router.get('/slug/:slug', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const restaurant = await restaurantModel.findBySlug(req.params.slug);
    
    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }
    
    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ success: false, error: 'Error fetching restaurant' });
  }
});

router.post('/', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const data: CreateRestaurantDTO = req.body;
    
    if (!data.name || !data.slug) {
      return res.status(400).json({ success: false, error: 'Name and slug are required' });
    }
    
    const id = await restaurantModel.create(data);
    const restaurant = await restaurantModel.findById(id);
    
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ success: false, error: 'Error creating restaurant' });
  }
});

router.put('/:id', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const id = parseInt(req.params.id);
    const data: Partial<CreateRestaurantDTO> = req.body;
    
    await restaurantModel.update(id, data);
    const restaurant = await restaurantModel.findById(id);
    
    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ success: false, error: 'Error updating restaurant' });
  }
});

router.delete('/:id', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const id = parseInt(req.params.id);
    await restaurantModel.delete(id);
    
    res.json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ success: false, error: 'Error deleting restaurant' });
  }
});

export default router;
