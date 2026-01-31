const express = require('express');
const { getPrisma } = require('../db');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Export endpoint - CSV download
router.get('/export', requireRole('ADMIN', 'TECH'), async (req, res) => {
  const prisma = getPrisma();
  
  try {
    // Get all tickets with related data
    const tickets = await prisma.ticket.findMany({
      include: {
        usf: true,
        category: true,
        requester: true,
        assignee: true
      },
      orderBy: { createdAt: 'desc' },
      take: 1000 // Limit to last 1000 tickets
    });

    // Build CSV
    const headers = [
      'ID',
      'Título',
      'USF',
      'Categoria',
      'Solicitante',
      'Técnico',
      'Status',
      'Prioridade',
      'Criado Em',
      'Resolvido Em',
      'SLA Vencido',
      'Tempo Resposta (h)',
      'Tempo Resolução (h)'
    ];

    const rows = tickets.map(ticket => {
      const createdAt = new Date(ticket.createdAt);
      const resolvedAt = ticket.resolvedAt ? new Date(ticket.resolvedAt) : null;
      const firstResponseAt = ticket.firstResponseAt ? new Date(ticket.firstResponseAt) : null;
      
      const responseTime = firstResponseAt 
        ? ((firstResponseAt - createdAt) / (1000 * 60 * 60)).toFixed(2)
        : 'N/A';
      
      const resolutionTime = resolvedAt
        ? ((resolvedAt - createdAt) / (1000 * 60 * 60)).toFixed(2)
        : 'N/A';

      return [
        ticket.id,
        `"${ticket.title.replace(/"/g, '""')}"`, // Escape quotes
        `"${ticket.usf?.nome || 'N/A'}"`,
        `"${ticket.category?.nome || 'N/A'}"`,
        `"${ticket.requester?.nome || 'N/A'}"`,
        `"${ticket.assignee?.nome || 'Não atribuído'}"`,
        ticket.status,
        ticket.priority,
        createdAt.toLocaleString('pt-BR'),
        resolvedAt ? resolvedAt.toLocaleString('pt-BR') : 'N/A',
        ticket.responseBreachedAt ? 'Sim' : 'Não',
        responseTime,
        resolutionTime
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    // Set headers for download
    const filename = `helpdesk-export-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Add BOM for Excel UTF-8 support
    res.write('\uFEFF');
    res.end(csv);

  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send('Erro ao exportar dados');
  }
});

module.exports = router;
