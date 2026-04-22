import { Router, Request, Response } from 'express';
import { tableModel } from '../models/table.js';
import { categoryModel } from '../models/category.js';
import { productModel } from '../models/product.js';
import { restaurantModel } from '../models/restaurant.js';
import { ApiResponse, CreateTableDTO } from '../models/types.js';

const router = Router();

router.get('/restaurant/:restaurantId', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const tables = await tableModel.findByRestaurant(restaurantId);
    res.json({ success: true, data: tables });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ success: false, error: 'Error fetching tables' });
  }
});

router.get('/:id', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const id = parseInt(req.params.id);
    const table = await tableModel.findById(id);
    
    if (!table) {
      return res.status(404).json({ success: false, error: 'Table not found' });
    }
    
    res.json({ success: true, data: table });
  } catch (error) {
    console.error('Error fetching table:', error);
    res.status(500).json({ success: false, error: 'Error fetching table' });
  }
});

router.post('/', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const data: CreateTableDTO = req.body;
    
    if (!data.restaurant_id || !data.number) {
      return res.status(400).json({ success: false, error: 'Restaurant ID and number are required' });
    }
    
    const id = await tableModel.create(data);
    const table = await tableModel.findById(id);
    
    res.status(201).json({ success: true, data: table });
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({ success: false, error: 'Error creating table' });
  }
});

router.post('/bulk/:restaurantId', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const { numbers } = req.body;
    
    if (!numbers || !Array.isArray(numbers)) {
      return res.status(400).json({ success: false, error: 'Numbers array is required' });
    }
    
    const inserted = await tableModel.createBulk(restaurantId, numbers);
    
    res.status(201).json({ success: true, data: { inserted } });
  } catch (error) {
    console.error('Error creating tables:', error);
    res.status(500).json({ success: false, error: 'Error creating tables' });
  }
});

router.delete('/:id', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const id = parseInt(req.params.id);
    await tableModel.delete(id);
    
    res.json({ success: true, message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    res.status(500).json({ success: false, error: 'Error deleting table' });
  }
});

router.get('/qr/:qrCode/menu', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const { qrCode } = req.params;
    const table = await tableModel.findByQrCode(qrCode);
    
    if (!table) {
      return res.status(404).json({ success: false, error: 'Invalid QR code' });
    }

    const restaurantId = (table as unknown as { restaurant_id: number }).restaurant_id;
    const restaurant = await restaurantModel.findById(restaurantId);
    const categories = await categoryModel.findByRestaurant(restaurantId);
    
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await productModel.findByCategory(Number(category.id));
        return { ...category, products };
      })
    );
    
    res.json({ 
      success: true, 
      data: {
        table,
        restaurant,
        menu: categoriesWithProducts
      }
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ success: false, error: 'Error fetching menu' });
  }
});

export default router;
