import { seedPermissions } from '../../src/utils/seeders/permissions';

(async () => {
  console.log('Start Permission Seeding...');
  await seedPermissions();
  console.log('Finished Permissions Seed');
})();
