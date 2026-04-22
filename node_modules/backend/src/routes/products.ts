import { Router, Request, Response } from 'express';
import { productModel } from '../models/product.js';
import { ApiResponse, CreateProductDTO } from '../models/types.js';

const router = Router();

router.get('/category/:categoryId', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const products = await productModel.findByCategory(categoryId);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Error fetching products' });
  }
});

router.get('/restaurant/:restaurantId', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const products = await productModel.findByRestaurant(restaurantId);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Error fetching products' });
  }
});

router.get('/:id', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const id = parseInt(req.params.id);
    const result = await productModel.findByIdWithVariants(id);
    
    if (!result) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Error fetching product' });
  }
});

router.post('/', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const data: CreateProductDTO = req.body;
    
    if (!data.category_id || !data.restaurant_id || !data.name || data.price === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Category ID, restaurant ID, name and price are required' 
      });
    }
    
    const id = await productModel.create(data);
    const result = await productModel.findByIdWithVariants(id);
    
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Error creating product' });
  }
});

router.put('/:id', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const id = parseInt(req.params.id);
    const data: Partial<CreateProductDTO> = req.body;
    
    await productModel.update(id, data);
    const result = await productModel.findByIdWithVariants(id);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Error updating product' });
  }
});

router.delete('/:id', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const id = parseInt(req.params.id);
    await productModel.delete(id);
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Error deleting product' });
  }
});

router.post('/:productId/variants', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const productId = parseInt(req.params.productId);
    const { name, price_modifier } = req.body;
    
    if (!name || price_modifier === undefined) {
      return res.status(400).json({ success: false, error: 'Name and price_modifier are required' });
    }
    
    const id = await productModel.addVariant(productId, name, price_modifier);
    
    res.status(201).json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error adding variant:', error);
    res.status(500).json({ success: false, error: 'Error adding variant' });
  }
});

router.delete('/variants/:variantId', async (req: Request, res: Response<ApiResponse<unknown>>) => {
  try {
    const variantId = parseInt(req.params.variantId);
    await productModel.deleteVariant(variantId);
    
    res.json({ success: true, message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Error deleting variant:', error);
    res.status(500).json({ success: false, error: 'Error deleting variant' });
  }
});

export default router;
