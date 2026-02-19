require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function upsertCategory(nome, system = false, ativo = true) {
  return prisma.category.upsert({
    where: { nome },
    update: { ativo, system },
    create: { nome, ativo, system }
  });
}

async function main() {
  // USFs
  const usfNomes = [
    'Maria Rosa Batista',
    'Inussum',
    'Waldemar Queiroz',
    'Reginaldo Romariz',
    'Walter P. Lobato',
    'Perote',
    'Cesp(Raimundo Ambé)',
    'Cesp(Neomar Varela)',
    'Raimunda Reis',
    'Fernando Mendes',
    '7 Travessa',
    'Mata Sede',
    'Vila Sorriso',
    'Nova Assis',
    'Arnoldo Tavares',
    'Manoel Valente',
    'Francisco Carneiro',
    'Josepha Murrieta',
    'Jorge Netto da Costa',
  ];

  const usfs = {};
  for (const nome of usfNomes) {
    usfs[nome] = await prisma.usf.upsert({
      where: { nome },
      update: {},
      create: { nome }
    });
  }

  // Categorias fixas (admin pode criar outras depois)
  const fixed = [
    'Rede/Internet',
    'Impressora',
    'Email',
    'Computador/Hardware',
    'Acesso/Permissão',
    'Sistemas (PEC/CADSUS)'
  ];

  for (const nome of fixed) {
    await upsertCategory(nome, true, true);
  }

  const cost = Number(process.env.BCRYPT_COST || 10);
  const passAdmin = await bcrypt.hash('sms.capanema2026', cost);
  const passOthers = await bcrypt.hash('Admin@123', cost);

  const primeiraUsf = usfs['Maria Rosa Batista'];

  // Admin
  await prisma.user.upsert({
    where: { login: 'Admin' },
    update: { passwordHash: passAdmin },
    create: {
      nome: 'Administrador',
      login: 'Admin',
      telefone: '000000000',
      cargo: 'Administrador',
      ativo: true,
      role: 'ADMIN',
      usfId: primeiraUsf.id,
      passwordHash: passAdmin
    }
  });

  // Técnico TI
  await prisma.user.upsert({
    where: { login: 'ti' },
    update: {},
    create: {
      nome: 'Técnico TI',
      login: 'ti',
      telefone: '000000000',
      cargo: 'Técnico de TI',
      ativo: true,
      role: 'TECH',
      usfId: primeiraUsf.id,
      passwordHash: passOthers
    }
  });

  // Enfermeiro / Coordenador
  await prisma.user.upsert({
    where: { login: 'enfermeiro' },
    update: {},
    create: {
      nome: 'Enfermeiro USF',
      login: 'enfermeiro',
      telefone: '000000000',
      cargo: 'Enfermeiro',
      ativo: true,
      role: 'COORDINATOR',
      usfId: usfs['Vila Sorriso'].id,
      passwordHash: passOthers
    }
  });

  // Solicitante
  await prisma.user.upsert({
    where: { login: 'solicitante' },
    update: {},
    create: {
      nome: 'Solicitante USF',
      login: 'solicitante',
      telefone: '000000000',
      cargo: 'Recepção',
      ativo: true,
      role: 'REQUESTER',
      usfId: usfs['Vila Sorriso'].id,
      passwordHash: passOthers
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed concluído.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
