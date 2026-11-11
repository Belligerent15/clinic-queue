const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/issue', (req, res) => {
  const { clinic_id = 'cl_manganeng', category_code, patient_name } = req.body;
  
  if (!['A', 'B', 'C', 'E'].includes(category_code)) {
    return res.status(400).json({ error: 'Invalid Category Code' });
  }

  const today = new Date().toISOString().split('T')[0];
  const lastTicket = db.prepare(`
    SELECT MAX(ticket_number) as max_num FROM tickets 
    WHERE clinic_id = ? AND category_code = ? AND DATE(created_at) = DATE(?)
  `).get(clinic_id, category_code, today);

  const nextNum = (lastTicket.max_num || 0) + 1;
  const formattedNum = String(nextNum).padStart(3, '0');
  const full_code = `${category_code}-${formattedNum}`;
  const id = `tck_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const stmt = db.prepare(`
    INSERT INTO tickets (id, clinic_id, category_code, ticket_number, full_code, status, patient_name)
    VALUES (?, ?, ?, ?, ?, 'WAITING', ?)
  `);
  stmt.run(id, clinic_id, category_code, nextNum, full_code, patient_name || null);

  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
  req.broadcast({ type: 'TICKET_CREATED', ticket });
  res.json(ticket);
});

router.post('/call-next', (req, res) => {
  const { clinic_id = 'cl_manganeng', room_number } = req.body;

  let ticket = db.prepare(`
    SELECT * FROM tickets 
    WHERE clinic_id = ? AND status = 'WAITING' 
    ORDER BY CASE WHEN category_code = 'E' THEN 1 ELSE 2 END, created_at ASC 
    LIMIT 1
  `).get(clinic_id);

  if (!ticket) {
    return res.status(404).json({ error: 'No waiting patients in queue' });
  }

  const called_at = new Date().toISOString();
  db.prepare(`
    UPDATE tickets SET status = 'CALLED', room_number = ?, called_at = ? WHERE id = ?
  `).run(room_number, called_at, ticket.id);

  const updatedTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticket.id);
  req.broadcast({ type: 'TICKET_CALLED', ticket: updatedTicket });
  res.json(updatedTicket);
});

router.post('/update-status', (req, res) => {
  const { ticket_id, status, room_number } = req.body;
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticket_id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  let completed_at = ticket.completed_at;
  if (status === 'COMPLETED') {
    completed_at = new Date().toISOString();
  }

  db.prepare(`
    UPDATE tickets 
    SET status = ?, room_number = COALESCE(?, room_number), completed_at = ? 
    WHERE id = ?
  `).run(status, room_number || null, completed_at, ticket_id);

  const updatedTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticket_id);
  req.broadcast({ type: 'TICKET_UPDATED', ticket: updatedTicket, action: status });
  res.json(updatedTicket);
});

router.get('/live', (req, res) => {
  const { clinic_id = 'cl_manganeng' } = req.query;

  const currentCall = db.prepare(`
    SELECT * FROM tickets WHERE clinic_id = ? AND status = 'CALLED' ORDER BY called_at DESC LIMIT 1
  `).get(clinic_id);

  const recentCalls = db.prepare(`
    SELECT * FROM tickets WHERE clinic_id = ? AND status IN ('CALLED', 'COMPLETED') ORDER BY called_at DESC LIMIT 5
  `).all(clinic_id);

  const counts = db.prepare(`
    SELECT category_code, COUNT(*) as count FROM tickets 
    WHERE clinic_id = ? AND status = 'WAITING' GROUP BY category_code
  `).all(clinic_id);

  res.json({ currentCall, recentCalls, waitingCounts: counts });
});

module.exports = router;
