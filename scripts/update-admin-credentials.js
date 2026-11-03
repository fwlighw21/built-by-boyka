const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating Admin credentials...');

  const newUsername = 'Boyka';
  const newPassword = 'Boyka1234';
  const passwordHash = await bcrypt.hash(newPassword, 10);

  // Update existing admin user(s)
  const users = await prisma.adminUser.findMany();
  if (users.length > 0) {
    for (const u of users) {
      await prisma.adminUser.update({
        where: { id: u.id },
        data: {
          username: newUsername,
          passwordHash: passwordHash,
        },
      });
      console.log(`✓ Updated user ID ${u.id} to username '${newUsername}'`);
    }
  } else {
    const created = await prisma.adminUser.create({
      data: {
        username: newUsername,
        passwordHash: passwordHash,
        name: 'Coach Boyka',
        email: 'admin@builtbyboyka.com',
      },
    });
    console.log(`✓ Created new admin user '${created.username}'`);
  }

  // Verify
  const updated = await prisma.adminUser.findUnique({
    where: { username: newUsername },
  });

  if (!updated) {
    throw new Error('Failed to find updated admin user!');
  }

  const isValid = await bcrypt.compare(newPassword, updated.passwordHash);
  console.log(`✓ Password verification test against '${newPassword}':`, isValid ? 'PASSED' : 'FAILED');

  console.log('🎉 Admin credentials successfully updated to:');
  console.log(`   Username: ${newUsername}`);
  console.log(`   Password: ${newPassword}`);
}

main()
  .catch((err) => {
    console.error('Error updating admin credentials:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
