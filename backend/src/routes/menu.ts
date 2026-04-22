import { Router, Request, Response } from 'express';
import { restaurantModel } from '../models/restaurant.js';
import { categoryModel } from '../models/category.js';
import { productModel } from '../models/product.js';
import { ApiResponse } from '../models/types.js';

const router = Router();

router.get('/', async (_req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const restaurants = await restaurantModel.findAll();
    
    if (restaurants.length === 0) {
      return res.json({ success: false, error: 'No hay restaurantes' });
    }

    const restaurant = restaurants[0];
    const categories = await categoryModel.findByRestaurant(restaurant.id);
    
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await productModel.findByCategory(category.id);
        return { ...category, products };
      })
    );

    res.json({ 
      success: true, 
      data: {
        restaurant,
        menu: categoriesWithProducts
      }
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ success: false, error: 'Error fetching menu' });
  }
});

router.get('/:slug', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const restaurant = await restaurantModel.findBySlug(req.params.slug);
    
    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurante no encontrado' });
    }

    const categories = await categoryModel.findByRestaurant(restaurant.id);
    
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await productModel.findByCategory(category.id);
        return { ...category, products };
      })
    );

    res.json({ 
      success: true, 
      data: {
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
