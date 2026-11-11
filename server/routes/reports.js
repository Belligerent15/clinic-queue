const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/reset-daily', (req, res) => {
  const { clinic_id = 'cl_manganeng' } = req.body;
  db.prepare(`DELETE FROM tickets WHERE clinic_id = ? AND status != 'WAITING'`).run(clinic_id);
  req.broadcast({ type: 'QUEUE_RESET' });
  res.json({ message: 'Daily queue sequence reset successfully' });
});

router.get('/doh-export', (req, res) => {
  const { clinic_id = 'cl_manganeng' } = req.query;
  const today = new Date().toISOString().split('T')[0];

  const clinic = db.prepare('SELECT name FROM clinics WHERE id = ?').get(clinic_id);
  const tickets = db.prepare(`
    SELECT category_code, status, created_at, called_at 
    FROM tickets WHERE clinic_id = ? AND DATE(created_at) = DATE(?)
  `).all(clinic_id, today);

  const totalServed = tickets.filter(t => t.status === 'COMPLETED' || t.status === 'CALLED').length;
  const countA = tickets.filter(t => t.category_code === 'A').length;
  const countB = tickets.filter(t => t.category_code === 'B').length;
  const countC = tickets.filter(t => t.category_code === 'C').length;
  const countE = tickets.filter(t => t.category_code === 'E').length;

  let totalWaitMin = 0;
  let countWithWait = 0;
  tickets.forEach(t => {
    if (t.called_at && t.created_at) {
      const waitMs = new Date(t.called_at) - new Date(t.created_at);
      totalWaitMin += waitMs / (1000 * 60);
      countWithWait++;
    }
  });

  const avgWait = countWithWait > 0 ? (totalWaitMin / countWithWait).toFixed(1) : 0;

  const csvRows = [
    ['Date', 'Clinic Name', 'Total Patients Served', 'Category A (General)', 'Category B (Chronic)', 'Category C (Maternal/Child)', 'Category E (Emergency)', 'Avg Wait Time (Mins)'],
    [today, `"${clinic ? clinic.name : 'Sekhukhune Clinic'}"`, totalServed, countA, countB, countC, countE, avgWait]
  ];

  const csvContent = csvRows.map(e => e.join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=DoH_Queue_Report_${today}.csv`);
  res.send(csvContent);
});

module.exports = router;
