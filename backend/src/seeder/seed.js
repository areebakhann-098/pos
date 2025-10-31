import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from '../config/db.js';
import {
  defineUserRoleRelation,
  defineRolePermissionRelation,
} from '../model/associations.js';

import Role from '../model/role.model.js';
import Permission from '../model/permission.model.js';
import User from '../model/user.model.js';

const seedUsersAndRoles = async () => {
  try {
    console.log('🔄 Connecting to DB and setting associations...');
    defineUserRoleRelation();
    defineRolePermissionRelation();
    await connectDb();

    // Define all permissions
    const allPermissions = [
      // user CRUD
      { resource: 'user', action: 'create', possession: 'any' },
      { resource: 'user', action: 'read', possession: 'any' },
      { resource: 'user', action: 'update', possession: 'any' },
      { resource: 'user', action: 'delete', possession: 'any' },
      // product CRUD
      { resource: 'product', action: 'create', possession: 'any' },
      { resource: 'product', action: 'read', possession: 'any' },
      { resource: 'product', action: 'update', possession: 'any' },
      { resource: 'product', action: 'delete', possession: 'any' },
    ];

    const createdPermissions = [];
    for (const perm of allPermissions) {
      const [p] = await Permission.findOrCreate({
        where: {
          resource: perm.resource,
          action: perm.action,
          possession: perm.possession,
        },
      });
      createdPermissions.push(p);
    }

    //  Create Admin Role
    const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } });

    //  Assign all permissions to admin
    await adminRole.setPermissions(createdPermissions);

    // 👤 Create Admin User (areeba)
    const adminEmail = 'areeba@example.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const adminUser = await User.create({
        name: 'areeba',
        email: adminEmail,
        password: 'admin123',
        Role: 'admin',
      });
      await adminUser.addRole(adminRole);
      console.log('Admin user "areeba" created and assigned "admin" role.');
    } else {
      console.log('ℹ Admin user "areeba" already exists.');
    }

    console.log(' Seeding completed successfully!');
  } catch (error) {
    console.error(' Seeder Error:', error.message);
  }
};

seedUsersAndRoles();
