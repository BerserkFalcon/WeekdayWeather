import { Router, Request, Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { city } = req.body;
    console.log('Received city:', city); // Add logging here
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const weather = await WeatherService.getWeatherForCity(city);

    await HistoryService.addCity(city);

    return res.json(weather);
  } catch (error) {
    console.error('Error retrieving weather data:', error); // Add logging here
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

router.get('/history', async (_req: Request, res: Response): Promise<Response> => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities);
  } catch (error) {
    console.error('Error retrieving search history:', error); // Add logging here
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

router.delete('/history/:id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting city from search history:', error); // Add logging here
    return res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;
