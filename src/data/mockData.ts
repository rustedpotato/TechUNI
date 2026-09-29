import type { Project, CompanyDemand } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    title: 'Precision Micro-Cold Storage for Horticulture',
    domain: 'Agritech & Thermal Systems',
    institution: 'National Institute of Technology, Trichy',
    leadInventor: 'Aarav Sharma & Team',
    leadEmail: 'aarav.sharma@nitt.edu',
    stage: 'prototype',
    trl: 5,
    score: 84,
    summary: 'Decentralized solar-assisted phase-change thermal storage for perishable berry & flower harvesting.',
    problem: 'Smallholder farmers experience 35% post-harvest spoilage within 48 hours due to lack of farm-gate chilling.',
    solution: 'Modular 250kg eutectic plate chilled storage container operating on a hybrid 2kW solar thermal compressor with 48h thermal buffer without grid power.',
    demoUrl: 'https://youtu.be/demo-coldstorage-sample',
    ipDisclosure: 'provisional_filed',
    tags: ['solar', 'thermal-storage', 'agritech', 'iot-monitoring', 'hardware'],
    createdDate: '2026-08-15',
    evaluations: [
      {
        id: 'eval-1',
        reviewerName: 'Dr. R. Venkatraman',
        reviewerRole: 'Senior Thermal Engineering Faculty',
        date: '2026-08-20',
        problemSeverity: 18,
        marketPotential: 17,
        technicalFeasibility: 13,
        differentiation: 12,
        ipPotential: 8,
        costScalability: 8,
        industryDemand: 9,
        totalScore: 85,
        notes: 'Impressive COP and thermal hold time. Requires field endurance testing under 45°C ambient temperatures.'
      },
      {
        id: 'eval-2',
        reviewerName: 'Meera Nambiar',
        reviewerRole: 'Agri-Supply Chain Director',
        date: '2026-08-22',
        problemSeverity: 19,
        marketPotential: 18,
        technicalFeasibility: 12,
        differentiation: 13,
        ipPotential: 7,
        costScalability: 7,
        industryDemand: 8,
        totalScore: 84,
        notes: 'FPO demand is clear. Capex must stay below 2.5L per unit for government subsidy eligibility.'
      }
    ],
    buyerValidations: [
      {
        id: 'bv-1',
        companyName: 'Sahyadri Agro Farms FPO',
        contactPerson: 'Kailash Patil (COO)',
        date: '2026-09-02',
        interestLevel: 'would_pilot',
        notes: 'Willing to host 2 units across grape packaging clusters in Nashik for 6 weeks.'
      },
      {
        id: 'bv-2',
        companyName: 'ColdEx Logistics Hubs',
        contactPerson: 'Vikram Seth (Head of Innovation)',
        date: '2026-09-08',
        interestLevel: 'would_pilot',
        notes: 'Looking for last-mile consolidation boxes. Requested telemetry integration.'
      }
    ],
    agreement: {
      id: 'agr-01',
      signedDate: '2026-09-12',
      isSigned: true,
      collegeCleared: true,
      inventorEquityPct: 65,
      companyEquityPct: 25,
      collegeRoyaltyPct: 10,
      continuationTerms: 'Team grants commercialization license to platform entity; continuation binding post graduation with ongoing inventor royalty pool.',
      documentName: 'NIT-Trichy_Commercialization_Agreement_Aarav.pdf'
    },
    milestones: [
      {
        id: 'ms-1',
        title: 'Compressor vibration damping & hermetic seal test',
        targetDate: '2026-09-20',
        status: 'completed',
        targetTrl: 4
      },
      {
        id: 'ms-2',
        title: '48-hour thermal buffer retention validation under 42°C ambient',
        targetDate: '2026-10-05',
        status: 'in_progress',
        targetTrl: 5
      },
      {
        id: 'ms-3',
        title: 'Complete TRL 6 ruggedized chassis field deployment in farm cluster',
        targetDate: '2026-10-25',
        status: 'pending',
        targetTrl: 6
      }
    ],
    testLogs: [
      {
        id: 'tl-1',
        title: 'Thermal decay bench test with ethylene glycol brine',
        date: '2026-09-18',
        location: 'NIT Thermal Lab 3',
        testerName: 'Dr. Venkatraman & Aarav',
        result: 'Held 4.2°C internal temperature for 49.5 hours against 40°C chamber ambient. Passed.',
        verifiedTrl: 5
      }
    ]
  },
  {
    id: 'proj-02',
    title: 'Acoustic AI Bearing Fault Detector for Railway Bogies',
    domain: 'Industrial IoT & Rail Tech',
    institution: 'IIT Kharagpur',
    leadInventor: 'Pooja Bannerjee',
    leadEmail: 'pooja.b@iitkgp.ac.in',
    stage: 'validate',
    trl: 4,
    score: 88,
    summary: 'Edge-AI wayside microphone array detecting subsurface micro-cracks in train wheel axles up to 120 km/h.',
    problem: 'Railway axle bearing seizures cause catastrophic derailments; current hot-axle detectors only warn at terminal failure stages.',
    solution: 'Multi-channel beamforming acoustic sensor mast deployed beside tracks, running edge spectrogram transformers predicting wear 4,000 km prior to failure.',
    demoUrl: 'https://rail-acoustic-edge.internal/demo',
    ipDisclosure: 'college_disclosed',
    tags: ['railway', 'acoustic-ai', 'tinyml', 'predictive-maintenance'],
    createdDate: '2026-08-28',
    evaluations: [
      {
        id: 'eval-3',
        reviewerName: 'Col. Sanjeev Roy (Retd)',
        reviewerRole: 'Former Railway Tech Advisor',
        date: '2026-09-05',
        problemSeverity: 20,
        marketPotential: 19,
        technicalFeasibility: 14,
        differentiation: 14,
        ipPotential: 9,
        costScalability: 7,
        industryDemand: 9,
        totalScore: 92,
        notes: 'Exceptional safety impact. Must integrate seamlessly with RDSO signaling specifications.'
      },
      {
        id: 'eval-4',
        reviewerName: 'Sunita Joshi',
        reviewerRole: 'Industrial IoT Partner',
        date: '2026-09-06',
        problemSeverity: 19,
        marketPotential: 17,
        technicalFeasibility: 13,
        differentiation: 13,
        ipPotential: 8,
        costScalability: 6,
        industryDemand: 8,
        totalScore: 84,
        notes: 'High potential. Variance with Reviewer 1 is 8 points (within acceptable <20 threshold).'
      }
    ],
    buyerValidations: [
      {
        id: 'bv-3',
        companyName: 'L&T Transportation Infrastructure',
        contactPerson: 'S. Rajagopalan',
        date: '2026-09-14',
        interestLevel: 'would_pilot',
        notes: 'Interested in trackside trial on Western Dedicated Freight Corridor spur.'
      }
      // Note: Only 1 "would_pilot" so far - Stage Gate requires 2 to proceed to Agree stage!
    ],
    milestones: [],
    testLogs: []
  },
  {
    id: 'proj-03',
    title: 'Enzymatic Bio-Degumming of Banana Pseudostem Fiber',
    domain: 'Sustainable Materials & Textiles',
    institution: 'PSG College of Technology, Coimbatore',
    leadInventor: 'Karthik Raja & Divya M.',
    leadEmail: 'karthik.raja@psgtech.ac.in',
    stage: 'screen',
    trl: 3,
    score: 71,
    summary: 'Eco-friendly enzyme cocktail that reduces banana fiber degumming cycle from 21 days to 6 hours with zero hazardous effluent.',
    problem: 'Natural agro-waste fiber processing relies on harsh sodium hydroxide soaking, which ruins tensile strength and creates toxic runoff.',
    solution: 'Bacterial consortium pectinase formula with enzymatic action operating at room temperature, producing textile-grade spinnable yarn.',
    demoUrl: '',
    ipDisclosure: 'none',
    tags: ['textiles', 'bio-enzymes', 'sustainable-materials', 'agro-waste'],
    createdDate: '2026-09-15',
    evaluations: [
      {
        id: 'eval-5',
        reviewerName: 'Dr. Ananya Sen',
        reviewerRole: 'Biotech Innovation Reviewer',
        date: '2026-09-22',
        problemSeverity: 16,
        marketPotential: 15,
        technicalFeasibility: 12,
        differentiation: 11,
        ipPotential: 6,
        costScalability: 5,
        industryDemand: 6,
        totalScore: 71,
        notes: 'Needs 2nd reviewer score before moving past Screen stage.'
      }
    ],
    buyerValidations: [],
    milestones: [],
    testLogs: []
  },
  {
    id: 'proj-04',
    title: 'High-Density Sodium-Ion Battery Anode from Agricultural Husk',
    domain: 'Clean Energy & Storage',
    institution: 'BITS Pilani',
    leadInventor: 'Rohan Deshmukh',
    leadEmail: 'rohan.deshmukh@pilani.bits-pilani.ac.in',
    stage: 'pilot',
    trl: 7,
    score: 93,
    summary: 'Hard carbon anode synthesized from pyrolyzed rice husk achieving 340 mAh/g reversible capacity at 3C discharge rate.',
    problem: 'Sodium-ion batteries suffer from low volumetric density and costly synthetic graphite alternatives.',
    solution: 'Engineered hierarchical pore hard carbon with 92% first-cycle coulombic efficiency synthesized via low-temp catalysed carbonization.',
    demoUrl: 'https://bits-battery-lab.org/anode-data',
    ipDisclosure: 'patented',
    tags: ['battery', 'sodium-ion', 'hard-carbon', 'ev', 'energy-storage'],
    createdDate: '2026-07-10',
    evaluations: [
      {
        id: 'eval-6',
        reviewerName: 'Dr. C. G. Menon',
        reviewerRole: 'Materials Science Lead',
        date: '2026-07-18',
        problemSeverity: 19,
        marketPotential: 20,
        technicalFeasibility: 14,
        differentiation: 14,
        ipPotential: 10,
        costScalability: 8,
        industryDemand: 9,
        totalScore: 94,
        notes: 'Groundbreaking capacity metrics. Cell pouch prototyping validated.'
      },
      {
        id: 'eval-7',
        reviewerName: 'Devika Singhania',
        reviewerRole: 'EV Battery Pack Integrator',
        date: '2026-07-20',
        problemSeverity: 19,
        marketPotential: 19,
        technicalFeasibility: 13,
        differentiation: 14,
        ipPotential: 9,
        costScalability: 9,
        industryDemand: 9,
        totalScore: 92,
        notes: 'Ready for 18650 cell pilot integration.'
      }
    ],
    buyerValidations: [
      {
        id: 'bv-4',
        companyName: 'Amaron Energy Systems',
        contactPerson: 'R. K. Verma',
        date: '2026-08-01',
        interestLevel: 'ready_to_contract',
        notes: 'Committed to batch testing 50kg hard carbon powder in 2-wheeler pilot cells.'
      },
      {
        id: 'bv-5',
        companyName: 'Tata AutoComp Mobility Lab',
        contactPerson: 'Gautam Rao',
        date: '2026-08-06',
        interestLevel: 'would_pilot',
        notes: 'Targeting cell packaging benchmarking in Pune.'
      }
    ],
    agreement: {
      id: 'agr-04',
      signedDate: '2026-08-15',
      isSigned: true,
      collegeCleared: true,
      inventorEquityPct: 60,
      companyEquityPct: 30,
      collegeRoyaltyPct: 10,
      continuationTerms: 'Standard tech transfer agreement with perpetual non-exclusive pilot licensing terms.',
      documentName: 'BITS_Amaron_Commercial_TermSheet.pdf'
    },
    milestones: [
      {
        id: 'ms-4',
        title: '50kg pilot batch kiln synthesis',
        targetDate: '2026-08-30',
        status: 'completed',
        targetTrl: 6
      },
      {
        id: 'ms-5',
        title: '1,000 cycle charge retention test in 18650 format',
        targetDate: '2026-09-30',
        status: 'in_progress',
        targetTrl: 7
      }
    ],
    testLogs: [
      {
        id: 'tl-4',
        title: 'C-rate discharge cycle test',
        date: '2026-09-02',
        location: 'Amaron Lab 2, Tirupati',
        testerName: 'Dr. Menon & Amaron R&D Team',
        result: 'Maintained 89.2% capacity retention after 500 cycles at 1C. Passed TRL 6 benchmark.',
        verifiedTrl: 6
      }
    ],
    pilot: {
      id: 'pilot-1',
      companyName: 'Amaron Energy Systems',
      scope: 'Evaluate 50kg cathode-anode slurry batch in commercial winding line for electric scooter battery modules.',
      durationWeeks: 12,
      successMetrics: 'Retain >85% capacity over 800 cycles, production yield >96%',
      status: 'in_progress',
      outcomeNotes: 'First 200 prototype cylindrical cells built. Cycle performance monitoring underway.'
    }
  }
];

export const INITIAL_DEMANDS: CompanyDemand[] = [
  {
    id: 'dem-01',
    companyName: 'Tata AutoComp Systems',
    sector: 'Automotive & Clean Energy',
    title: 'Next-Gen Anode & Solid Electrolytes for 2-Wheeler EV Cells',
    description: 'Looking for domestic university IP around hard-carbon anodes or non-flammable gel electrolytes with thermal stability up to 60°C.',
    tags: ['battery', 'sodium-ion', 'hard-carbon', 'ev', 'thermal'],
    budgetSignal: 'INR 15 - 25 Lakhs per validated pilot',
    targetDeliveryMonths: 6
  },
  {
    id: 'dem-02',
    companyName: 'L&T Transportation Infrastructure',
    sector: 'Railway & Heavy Infrastructure',
    title: 'Acoustic / Vibration Trackside Defect Detection for High-Speed Freight',
    description: 'Autonomous wayside sensor rigs capable of real-time classification of wheel flats, bearing degradation, and rail gauge stress.',
    tags: ['railway', 'acoustic-ai', 'tinyml', 'predictive-maintenance', 'iot-monitoring'],
    budgetSignal: 'INR 30 - 50 Lakhs pilot with deployment option on DFC',
    targetDeliveryMonths: 9
  },
  {
    id: 'dem-03',
    companyName: 'Sahyadri Agro & FPO Consortium',
    sector: 'Agritech & Cold Chain',
    title: 'Decentralized Farm-Gate Solar Cold Storage for Perishables',
    description: 'Micro-storage chambers (200-500kg) operating without continuous 3-phase grid power for rural farm collections.',
    tags: ['solar', 'thermal-storage', 'agritech', 'hardware'],
    budgetSignal: 'INR 8 - 12 Lakhs subsidy co-financing + immediate field order',
    targetDeliveryMonths: 4
  }
];
