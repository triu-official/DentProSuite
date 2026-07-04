import { Request, Response } from 'express';
import { getDatabaseAdapter } from '../storage/DatabaseService.js';
import { Appointment } from '../../../shared/types/index.js';

const dbAppointments = getDatabaseAdapter<Appointment>('appointments');

// Simplified simulated billing/revenue computation
// We'll calculate revenue based on completed appointments
export const getRevenueOverview = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query; // YYYY-MM-DD

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const appointments = await dbAppointments.getAll();

    let totalRevenue = 0;
    let completedCount = 0;

    // Simulate basic static pricing for this example
    const AVG_REVENUE_PER_APPT = 150;

    appointments.forEach(appt => {
      if (appt.date >= startDate && appt.date <= endDate) {
        if (appt.status === 'COMPLETED') {
          completedCount++;
          // In a real app we'd sum up appt.services prices
          totalRevenue += AVG_REVENUE_PER_APPT;
        }
      }
    });

    res.json({
      startDate,
      endDate,
      totalRevenue,
      appointmentsCompleted: completedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
