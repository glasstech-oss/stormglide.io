export const caseStudies = [
  {
    id: 'dental-system',
    title: 'Dental Management System',
    industry: 'Healthcare',
    shortDescription: 'End-to-end platform for dental clinic operations',
    problem:
      "A growing dental clinic was managing patient records on paper, scheduling appointments through WhatsApp and phone calls, and manually tracking treatment plans and billing. Clinicians had no way to see patient history during appointments.",
    solution:
      'We built a comprehensive digital platform covering patient records, appointment scheduling, treatment plan management, pharmacy integration, and billing — all accessible to clinicians, administrators, and patients.',
    features: [
      'Patient record management with full medical history',
      'Online and in-clinic appointment scheduling',
      'Digital treatment planning and documentation',
      'Prescription and pharmacy management',
      'Automated billing and payment tracking',
    ],
    technologies: ['React', 'Firebase', 'Node.js', 'Tailwind CSS'],
    color: 'var(--color-success)',
    outcome: '90% reduction in appointment no-shows. Patient records now searchable in seconds, not hours.',
    demoUrl: 'https://nexusdental--nexusdentalsystem.us-east4.hosted.app/',
  },
  {
    id: 'cargoscan',
    title: 'CargoScan Logistics System',
    industry: 'Logistics',
    shortDescription: 'CBM calculations and freight cost estimation tool',
    problem:
      'Freight forwarders and importers were using manual calculations and Excel spreadsheets to calculate cubic meters (CBM) and estimate freight costs. This was slow, error-prone, and made it hard to give customers quick quotes.',
    solution:
      'Built a web app that calculates CBM instantly from dimensions, estimates freight costs by route, and generates shareable reports. Designed specifically for Ghana-China trade routes.',
    features: [
      'Instant CBM calculation from length, width, height',
      'Multi-package shipment tracking',
      'Freight cost estimation by route and carrier',
      'Shareable PDF shipment reports',
      'Route-specific pricing',
    ],
    technologies: ['React', 'Firebase', 'Tailwind CSS'],
    color: 'var(--color-warning)',
    outcome: 'Quotes now prepared in 2 minutes instead of 30. Used by 200+ importers.',
    demoUrl: 'https://cargoscan-app-2026.web.app/',
  },
  {
    id: 'hrm-system',
    title: 'HRM Platform',
    industry: 'Human Resources',
    shortDescription: 'Multi-company HR, payroll, and employee management',
    problem:
      'Manufacturing and logistics companies were manually processing payroll in Excel, tracking leave on paper, and managing employee records across multiple spreadsheets. Compliance reporting was complex and error-prone.',
    solution:
      'Built a multi-tenant HRM platform handling full employee lifecycle — onboarding, attendance, leave management, payroll processing, performance reviews, and statutory compliance reporting.',
    features: [
      'Multi-company and multi-branch payroll',
      'Automated leave and attendance tracking',
      'Salary and bonus calculations with deductions',
      'Statutory compliance (SSNIT, PAYE, tax)',
      'Employee self-service portal',
    ],
    technologies: ['React', 'Firebase', 'Node.js', 'PostgreSQL'],
    color: 'var(--color-accent-blue)',
    outcome: 'Payroll processing time cut from 8 hours to 1 hour per cycle.',
    demoUrl: 'https://mcbauchemieguinea.com/',
  },
  {
    id: 'erp-website',
    title: 'Project & Client Management ERP',
    industry: 'General Business',
    shortDescription: 'Integrated project management, client relations, and operations',
    problem:
      'A large enterprise was using separate systems for project tracking, client management, and reporting. Data was siloed, visibility was poor, and decisions were made on outdated information.',
    solution:
      'Designed and built a connected ERP system integrating project lifecycles, client portals, resource tracking, and real-time operational dashboards.',
    features: [
      'End-to-end project tracking and milestones',
      'Client portal for status updates',
      'Real-time resource and timeline dashboards',
      'Financial reporting and profit analysis',
      'Multi-user role-based access control',
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    color: 'var(--color-success)',
    outcome: 'Project visibility reduced decision time from days to minutes.',
    demoUrl: 'https://westlinefuture.web.app/',
  },
  {
    id: 'retail-erp',
    title: 'Retail Management & ERP',
    industry: 'Retail & Operations',
    shortDescription: 'Multi-branch retail management and ERP system',
    problem:
      'A retail chain with multiple branches struggled to synchronize inventory, sales, and operations across locations, leading to stock discrepancies and reporting delays.',
    solution:
      'Built a centralized ERP system that connects point-of-sale operations across all branches with real-time inventory, financial reporting, and supply chain management.',
    features: [
      'Multi-branch point-of-sale synchronization',
      'Real-time branch inventory tracking',
      'Centralized financial and operational reporting',
      'Supply chain and vendor management',
      'Employee performance tracking per branch',
    ],
    technologies: ['React', 'Node.js', 'Firebase', 'Tailwind CSS'],
    color: 'var(--color-accent-blue)',
    outcome: 'Eliminated stock discrepancies and reduced end-of-month reporting time by 80%.',
    demoUrl: 'https://lollarodgh.web.app/',
  },
  {
    id: 'inventory-system',
    title: 'Inventory & Stock Management',
    industry: 'Procurement',
    shortDescription: 'Centralized stock tracking and procurement workflow',
    problem:
      'A trading business was losing revenue due to stockouts and expired goods because their inventory was tracked on paper across three different warehouse locations.',
    solution:
      'Built a unified inventory system with real-time stock levels, automated low-stock alerts, and integrated procurement ordering workflows.',
    features: [
      'Multi-warehouse stock tracking',
      'Automated reorder alerts',
      'Barcode scanning integration',
      'Supplier and procurement management',
      'Stock variance reporting',
    ],
    technologies: ['React', 'Supabase', 'Node.js'],
    color: 'var(--sg-accent)',
    outcome: 'Reduced stockouts by 40% and improved inventory accuracy to 99%.',
    demoUrl: '#placeholder-inventory',
  },
  {
    id: 'sano',
    title: 'SANO Skincare App',
    industry: 'Health & Wellness',
    shortDescription: 'AI-powered skincare recommendations and health tracking',
    problem:
      'Many users lacked access to personalized skincare guidance. SANO was created to help users understand their skin type and get personalized product recommendations.',
    solution:
      'Developed a mobile-first platform with AI-powered skin analysis, personalized product recommendations, and health tracking.',
    features: [
      'AI-powered skin type analysis from photos',
      'Personalized skincare product recommendations',
      'Routine building and tracking',
      'Community reviews and ratings',
      'Integration with local skincare brands',
    ],
    technologies: ['React Native', 'TensorFlow Lite', 'Firebase'],
    color: 'var(--color-danger)',
    outcome: 'Thousands of users onboarded with accurate AI skin analysis.',
    demoUrl: '#placeholder-sano',
  },
]
