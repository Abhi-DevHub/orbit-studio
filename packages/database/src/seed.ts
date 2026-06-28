import { prisma } from './index';

const TEMPLATES = [
  {
    name: 'Netflix Clone',
    description: 'Video streaming platform architecture with microservices',
    category: 'streaming',
    nodes: [
      { id: 'cdn', type: 'cdn', position: { x: 100, y: 100 }, data: { label: 'CDN', metadata: { status: 'planned' } } },
      { id: 'gateway', type: 'gateway', position: { x: 400, y: 100 }, data: { label: 'API Gateway', metadata: { status: 'planned' } } },
      { id: 'auth', type: 'auth', position: { x: 400, y: 250 }, data: { label: 'Auth Service', metadata: { status: 'planned' } } },
      { id: 'user-svc', type: 'backend', position: { x: 100, y: 400 }, data: { label: 'User Service', metadata: { status: 'planned' } } },
      { id: 'content-svc', type: 'backend', position: { x: 400, y: 400 }, data: { label: 'Content Service', metadata: { status: 'planned' } } },
      { id: 'rec-svc', type: 'backend', position: { x: 700, y: 400 }, data: { label: 'Recommendation Engine', metadata: { status: 'planned' } } },
      { id: 'pg', type: 'database', position: { x: 100, y: 550 }, data: { label: 'PostgreSQL', metadata: { status: 'planned' } } },
      { id: 'redis', type: 'cache', position: { x: 400, y: 550 }, data: { label: 'Redis Cache', metadata: { status: 'planned' } } },
      { id: 's3', type: 'storage', position: { x: 700, y: 550 }, data: { label: 'S3 Storage', metadata: { status: 'planned' } } },
    ],
    edges: [
      { id: 'e1', source: 'cdn', target: 'gateway', type: 'smoothstep' },
      { id: 'e2', source: 'gateway', target: 'auth', type: 'smoothstep' },
      { id: 'e3', source: 'gateway', target: 'user-svc', type: 'smoothstep' },
      { id: 'e4', source: 'gateway', target: 'content-svc', type: 'smoothstep' },
      { id: 'e5', source: 'gateway', target: 'rec-svc', type: 'smoothstep' },
      { id: 'e6', source: 'user-svc', target: 'pg', type: 'smoothstep' },
      { id: 'e7', source: 'content-svc', target: 'pg', type: 'smoothstep' },
      { id: 'e8', source: 'content-svc', target: 's3', type: 'smoothstep' },
      { id: 'e9', source: 'content-svc', target: 'redis', type: 'smoothstep' },
    ],
    icon: 'play',
  },
  {
    name: 'SaaS Platform',
    description: 'Multi-tenant SaaS application with billing and analytics',
    category: 'saas',
    nodes: [
      { id: 'gateway', type: 'gateway', position: { x: 300, y: 100 }, data: { label: 'API Gateway', metadata: { status: 'planned' } } },
      { id: 'frontend', type: 'frontend', position: { x: 100, y: 100 }, data: { label: 'Web App', metadata: { status: 'planned' } } },
      { id: 'auth', type: 'auth', position: { x: 300, y: 250 }, data: { label: 'Auth Service', metadata: { status: 'planned' } } },
      { id: 'api-svc', type: 'backend', position: { x: 100, y: 400 }, data: { label: 'API Service', metadata: { status: 'planned' } } },
      { id: 'billing', type: 'backend', position: { x: 300, y: 400 }, data: { label: 'Billing Service', metadata: { status: 'planned' } } },
      { id: 'worker', type: 'worker', position: { x: 500, y: 400 }, data: { label: 'Background Worker', metadata: { status: 'planned' } } },
      { id: 'pg', type: 'database', position: { x: 100, y: 550 }, data: { label: 'PostgreSQL', metadata: { status: 'planned' } } },
      { id: 'redis', type: 'cache', position: { x: 300, y: 550 }, data: { label: 'Redis', metadata: { status: 'planned' } } },
      { id: 'queue', type: 'queue', position: { x: 500, y: 550 }, data: { label: 'Job Queue', metadata: { status: 'planned' } } },
    ],
    edges: [
      { id: 'e1', source: 'frontend', target: 'gateway', type: 'smoothstep' },
      { id: 'e2', source: 'gateway', target: 'auth', type: 'smoothstep' },
      { id: 'e3', source: 'gateway', target: 'api-svc', type: 'smoothstep' },
      { id: 'e4', source: 'gateway', target: 'billing', type: 'smoothstep' },
      { id: 'e5', source: 'api-svc', target: 'pg', type: 'smoothstep' },
      { id: 'e6', source: 'api-svc', target: 'redis', type: 'smoothstep' },
      { id: 'e7', source: 'billing', target: 'pg', type: 'smoothstep' },
      { id: 'e8', source: 'api-svc', target: 'queue', type: 'smoothstep' },
      { id: 'e9', source: 'queue', target: 'worker', type: 'smoothstep' },
    ],
    icon: 'building',
  },
  {
    name: 'E-Commerce',
    description: 'Full e-commerce platform with cart, orders, payments, and inventory',
    category: 'ecommerce',
    nodes: [
      { id: 'cdn', type: 'cdn', position: { x: 100, y: 50 }, data: { label: 'CloudFront CDN', metadata: { status: 'planned' } } },
      { id: 'frontend', type: 'frontend', position: { x: 100, y: 200 }, data: { label: 'Next.js Storefront', metadata: { status: 'planned' } } },
      { id: 'gateway', type: 'gateway', position: { x: 400, y: 50 }, data: { label: 'API Gateway', metadata: { status: 'planned' } } },
      { id: 'auth', type: 'auth', position: { x: 400, y: 200 }, data: { label: 'Auth (Clerk)', metadata: { status: 'planned' } } },
      { id: 'product-svc', type: 'backend', position: { x: 100, y: 400 }, data: { label: 'Product Service', metadata: { status: 'planned' } } },
      { id: 'cart-svc', type: 'backend', position: { x: 300, y: 400 }, data: { label: 'Cart Service', metadata: { status: 'planned' } } },
      { id: 'order-svc', type: 'backend', position: { x: 500, y: 400 }, data: { label: 'Order Service', metadata: { status: 'planned' } } },
      { id: 'payment-svc', type: 'backend', position: { x: 700, y: 400 }, data: { label: 'Payment (Stripe)', metadata: { status: 'planned' } } },
      { id: 'pg', type: 'database', position: { x: 200, y: 550 }, data: { label: 'PostgreSQL', metadata: { status: 'planned' } } },
      { id: 'redis', type: 'cache', position: { x: 500, y: 550 }, data: { label: 'Redis Cache', metadata: { status: 'planned' } } },
      { id: 'queue', type: 'queue', position: { x: 700, y: 550 }, data: { label: 'Order Queue', metadata: { status: 'planned' } } },
    ],
    edges: [
      { id: 'e1', source: 'cdn', target: 'frontend', type: 'smoothstep' },
      { id: 'e2', source: 'frontend', target: 'gateway', type: 'smoothstep' },
      { id: 'e3', source: 'gateway', target: 'auth', type: 'smoothstep' },
      { id: 'e4', source: 'gateway', target: 'product-svc', type: 'smoothstep' },
      { id: 'e5', source: 'gateway', target: 'cart-svc', type: 'smoothstep' },
      { id: 'e6', source: 'gateway', target: 'order-svc', type: 'smoothstep' },
      { id: 'e7', source: 'cart-svc', target: 'redis', type: 'smoothstep' },
      { id: 'e8', source: 'product-svc', target: 'pg', type: 'smoothstep' },
      { id: 'e9', source: 'order-svc', target: 'pg', type: 'smoothstep' },
      { id: 'e10', source: 'order-svc', target: 'payment-svc', type: 'smoothstep' },
      { id: 'e11', source: 'order-svc', target: 'queue', type: 'smoothstep' },
    ],
    icon: 'shopping-cart',
  },
];

async function seed() {
  console.log('🌱 Seeding templates...');

  for (const template of TEMPLATES) {
    await prisma.template.upsert({
      where: { id: template.name.toLowerCase().replace(/\s+/g, '-') },
      update: template,
      create: {
        id: template.name.toLowerCase().replace(/\s+/g, '-'),
        ...template,
      },
    });
  }

  console.log(`✅ Seeded ${TEMPLATES.length} templates`);
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
