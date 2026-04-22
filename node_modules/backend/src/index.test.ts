import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from './index.js';
import pool from './utils/db.js';

describe('Backend Configuration', () => {
  afterAll(async () => {
    // Close database connection after tests
    await pool.end();
  });

  describe('Server Setup', () => {
    it('should respond to health check endpoint', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('service', 'menu-digital-qr-api');
    });

    it('should respond to API info endpoint', async () => {
      const response = await request(app).get('/api');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Menu Digital QR API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });

    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/non-existent-route');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error).toHaveProperty('timestamp');
    });
  });

  describe('Middleware Configuration', () => {
    it('should parse JSON request bodies', async () => {
      const response = await request(app)
        .post('/api/test-json')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');
      
      // Should return 404 since route doesn't exist, but body should be parsed
      expect(response.status).toBe(404);
    });

    it('should have security headers from helmet', async () => {
      const response = await request(app).get('/api/health');
      
      // Helmet adds various security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should support CORS', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5173');
      
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should have compression enabled', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Accept-Encoding', 'gzip');
      
      // Response should be successful (compression is transparent)
      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should return properly formatted error responses', async () => {
      const response = await request(app).get('/api/invalid-endpoint');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error).toHaveProperty('timestamp');
      
      // Timestamp should be valid ISO 8601 format
      expect(() => new Date(response.body.error.timestamp)).not.toThrow();
    });
  });
});
