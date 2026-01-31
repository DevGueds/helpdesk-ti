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
  // USFs (note: com o model renomeado para Usf, o delegate é prisma.usf)
  const usfA = await prisma.usf.upsert({
    where: { nome: 'SMS' },
    update: {},
    create: {
      nome: 'SMS',
      ipOnt: '192.168.1.1',
      modeloSwitch: 'TP-Link 24p',
      provedorInternet: 'Vivo Fibra'
    }
  });

  const usfB = await prisma.usf.upsert({
    where: { nome: 'USF Vila Sorriso' },
    update: {},
    create: { nome: 'USF Vila Sorriso' }
  });

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

  // Insumos
  const insumos = [
    { nome: 'Toner 285A', tipo: 'TONER', quantidadeAtual: 5, quantidadeMinima: 2 },
    { nome: 'Cabo de Rede (Metro)', tipo: 'CABO', quantidadeAtual: 300, quantidadeMinima: 50 },
    { nome: 'Conector RJ45', tipo: 'PECAS', quantidadeAtual: 100, quantidadeMinima: 20 },
    { nome: 'Mouse USB', tipo: 'PECAS', quantidadeAtual: 10, quantidadeMinima: 5 },
  ];

  for (const item of insumos) {
    await prisma.insumo.create({
      data: item
    }).catch(() => {
      // Ignorar se já existir (hack simples, ideal seria upsert pelo nome se fosse unico)
      // Como não definimos @unique no nome do Insumo, vamos checar antes ou usar createMany
    });
    // Melhor abordagem para seed seguro:
    const exists = await prisma.insumo.findFirst({ where: { nome: item.nome } });
    if (!exists) {
      await prisma.insumo.create({ data: item });
    }
  }

  const cost = Number(process.env.BCRYPT_COST || 10);
  const passHash = await bcrypt.hash('Admin@123', cost);

  // Admin
  await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      nome: 'Administrador',
      login: 'admin',
      telefone: '000000000',
      cargo: 'Administrador',
      ativo: true,
      role: 'ADMIN',
      usfId: usfA.id,
      passwordHash: passHash
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
      usfId: usfA.id,
      passwordHash: passHash
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
      usfId: usfB.id,
      passwordHash: passHash
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
      usfId: usfB.id,
      passwordHash: passHash
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
