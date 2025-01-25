import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateFamilies() {
  const users = await prisma.user.findMany({
    where: {
      familyCode: { not: null }
    }
  })

  for (const user of users) {
    if (!user.familyCode) continue

    // Create or find family
    const family = await prisma.family.upsert({
      where: { code: user.familyCode },
      create: {
        name: `${user.name}'s Family`,
        code: user.familyCode,
        settings: {
          notifications: { familyAlerts: true, memberActivity: true },
          security: { autoBlock: true, parentApproval: true }
        }
      },
      update: {}
    })

    // Update user's family reference
    await prisma.user.update({
      where: { id: user.id },
      data: { familyId: family.id }
    })
  }
}

migrateFamilies()
  .then(() => console.log('Migration complete'))
  .catch(console.error)
  .finally(() => prisma.$disconnect())
