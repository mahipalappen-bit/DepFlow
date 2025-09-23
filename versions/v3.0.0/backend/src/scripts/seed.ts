import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase } from '@/config/database';
import { User } from '@/models/User';
import { Team } from '@/models/Team';
import { Dependency } from '@/models/Dependency';
import { UpdateRequest } from '@/models/UpdateRequest';
import { Notification } from '@/models/Notification';
import { logger } from '@/utils/logger';

// Seed data
const seedUsers = [
  {
    email: 'admin@demo.com',
    password: 'admin123456',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    emailVerified: true,
  },
  {
    email: 'user@demo.com',
    password: 'user123456',
    firstName: 'Demo',
    lastName: 'User',
    role: 'team_member',
    isActive: true,
    emailVerified: true,
  },
];

const seedTeams = [
  {
    name: 'Frontend Team',
    description: 'React and Next.js development team',
    isActive: true,
  },
  {
    name: 'Backend Team',
    description: 'Node.js and API development team',
    isActive: true,
  },
  {
    name: 'DevOps Team',
    description: 'Infrastructure and deployment team',
    isActive: true,
  },
];

const seedDependencies = [
  {
    name: 'react',
    version: '18.2.0',
    latestVersion: '18.2.0',
    description: 'A JavaScript library for building user interfaces',
    type: 'library',
    category: 'frontend',
    status: 'up_to_date',
    healthScore: 'healthy',
  },
  {
    name: 'express',
    version: '4.18.2',
    latestVersion: '4.18.2',
    description: 'Fast, unopinionated, minimalist web framework for node',
    type: 'framework',
    category: 'backend',
    status: 'up_to_date',
    healthScore: 'healthy',
  },
  {
    name: 'lodash',
    version: '4.17.15',
    latestVersion: '4.17.21',
    description: 'A modern JavaScript utility library',
    type: 'library',
    category: 'frontend',
    status: 'outdated',
    healthScore: 'warning',
    vulnerabilities: [
      {
        id: 'CVE-2021-23337',
        severity: 'high',
        title: 'Command Injection in lodash',
        description: 'lodash versions prior to 4.17.21 are vulnerable to Command Injection',
        cvssScore: 7.2,
        publishedDate: new Date('2021-02-15'),
        patchedVersion: '4.17.21',
        references: ['https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-23337'],
      },
    ],
  },
];

async function seedDatabase() {
  try {
    logger.info('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDatabase();
    
    // Clear existing data in development
    if (process.env.NODE_ENV === 'development') {
      await Promise.all([
        Notification.deleteMany({}),
        UpdateRequest.deleteMany({}),
        Dependency.deleteMany({}),
        Team.deleteMany({}),
        User.deleteMany({}),
      ]);
      logger.info('🗑️  Cleared existing data');
    }
    
    // Seed users
    const users = await User.insertMany(seedUsers);
    logger.info(`👤 Created ${users.length} users`);
    
    // Seed teams
    const teams = await Team.insertMany(seedTeams.map(team => ({
      ...team,
      memberIds: [users[1]._id], // Add demo user to teams
      leadId: users[1]._id, // Make demo user team lead
    })));
    logger.info(`👥 Created ${teams.length} teams`);
    
    // Update users with team assignments
    await User.findByIdAndUpdate(users[1]._id, {
      teamIds: teams.map(team => team._id),
    });
    
    // Seed dependencies
    const dependencies = await Dependency.insertMany(seedDependencies.map(dep => ({
      ...dep,
      ownerTeamId: teams[Math.floor(Math.random() * teams.length)]._id,
      usedByTeamIds: [teams[0]._id, teams[1]._id],
      lastChecked: new Date(),
      metadata: {
        tags: ['demo', 'seeded'],
        customFields: {},
      },
    })));
    logger.info(`📦 Created ${dependencies.length} dependencies`);
    
    // Create a sample update request
    const sampleRequest = await UpdateRequest.create({
      dependencyId: dependencies[2]._id, // lodash
      requestedById: users[1]._id,
      targetVersion: '4.17.21',
      currentVersion: '4.17.15',
      justification: 'Security vulnerability fix - CVE-2021-23337',
      priority: 'high',
      status: 'pending',
      testingRequired: true,
      timeline: {
        requestedAt: new Date(),
      },
      statusHistory: [{
        status: 'pending',
        changedAt: new Date(),
        changedBy: users[1]._id,
        notes: 'Initial request created',
      }],
    });
    logger.info(`📋 Created sample update request`);
    
    // Create welcome notifications
    await Notification.create({
      userId: users[0]._id,
      type: 'system_alert',
      title: 'Welcome to Dependency Management!',
      message: 'Your admin account has been set up successfully.',
      priority: 'medium',
      data: {
        actionUrl: '/dashboard',
      },
    });
    
    await Notification.create({
      userId: users[1]._id,
      type: 'vulnerability_alert',
      title: 'Security Alert: lodash vulnerability',
      message: 'A high-severity vulnerability was detected in lodash 4.17.15',
      priority: 'high',
      data: {
        dependencyId: dependencies[2]._id,
        actionUrl: `/dependencies/${dependencies[2]._id}`,
      },
    });
    
    logger.info('📧 Created sample notifications');
    
    logger.info('✅ Database seeding completed successfully!');
    logger.info('🔐 Demo credentials:');
    logger.info('   Admin: admin@demo.com / admin123456');
    logger.info('   User:  user@demo.com / user123456');
    
    process.exit(0);
    
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;


