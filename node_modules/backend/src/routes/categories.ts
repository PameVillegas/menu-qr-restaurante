import { Router, Request, Response } from 'express';
import { categoryModel } from '../models/category.js';
import { ApiResponse, CreateCategoryDTO } from '../models/types.js';

const router = Router();

router.get('/restaurant/:restaurantId', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const categories = await categoryModel.findByRestaurant(restaurantId);
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Error fetching categories' });
  }
});

router.get('/:id', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const id = parseInt(req.params.id);
    const category = await categoryModel.findById(id);
    
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, error: 'Error fetching category' });
  }
});

router.post('/', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const data: CreateCategoryDTO = req.body;
    
    if (!data.restaurant_id || !data.name) {
      return res.status(400).json({ success: false, error: 'Restaurant ID and name are required' });
    }
    
    const id = await categoryModel.create(data);
    const category = await categoryModel.findById(id);
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, error: 'Error creating category' });
  }
});

router.put('/:id', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const id = parseInt(req.params.id);
    const data: Partial<CreateCategoryDTO> = req.body;
    
    await categoryModel.update(id, data);
    const category = await categoryModel.findById(id);
    
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, error: 'Error updating category' });
  }
});

router.delete('/:id', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const id = parseInt(req.params.id);
    await categoryModel.delete(id);
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, error: 'Error deleting category' });
  }
});

router.post('/reorder/:restaurantId', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const { categoryIds } = req.body;
    
    await categoryModel.reorder(restaurantId, categoryIds);
    
    res.json({ success: true, message: 'Categories reordered successfully' });
  } catch (error) {
    console.error('Error reordering categories:', error);
    res.status(500).json({ success: false, error: 'Error reordering categories' });
  }
});

export default router;
