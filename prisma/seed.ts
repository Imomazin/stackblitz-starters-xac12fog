import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding R_LUMINA demo users...');

  const password = await bcrypt.hash('demo1234', 10);

  const users = [
    {
      email: 'executive@rlumina.io',
      name: 'Executive User',
      role: 'EXECUTIVE' as const,
      password,
    },
    {
      email: 'analyst@rlumina.io',
      name: 'Risk Analyst',
      role: 'ANALYST' as const,
      password,
    },
    {
      email: 'ops@rlumina.io',
      name: 'Operations Manager',
      role: 'OPERATIONS' as const,
      password,
    },
    {
      email: 'finance@rlumina.io',
      name: 'Finance Controller',
      role: 'FINANCE' as const,
      password,
    },
    {
      email: 'auditor@rlumina.io',
      name: 'Auditor',
      role: 'AUDITOR' as const,
      password,
    },
    {
      email: 'admin@rlumina.io',
      name: 'Administrator',
      role: 'ADMIN' as const,
      password,
    },
    {
      email: 'owner@rlumina.io',
      name: 'System Owner',
      role: 'OWNER' as const,
      password,
    },
  ];

  for (const user of users) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(`✅ Created user: ${created.email} (${created.role})`);
  }

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
