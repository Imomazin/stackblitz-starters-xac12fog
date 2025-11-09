// Case study data for R_LUMINA
export type CaseStudy = {
  id: string;
  title: string;
  subtitle: string;
  riskBadge: string;
  badgeColor: string;
  gradient: string;
  imageUrl: string;
  overview: string;
  projectDetails: {
    duration: string;
    budget: string;
    location: string;
    stakeholders: string;
  };
  riskChallenges: string[];
  riskMethodsUsed: string[];
  outcomes: string[];
  keyMetrics: {
    label: string;
    value: string;
  }[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'panama-canal',
    title: 'Panama Canal Expansion',
    subtitle: 'Managing geotechnical risks, cost overruns, and 9-year construction timeline',
    riskBadge: '$5.4B Budget Risk',
    badgeColor: 'bg-red-500',
    gradient: 'from-blue-900/90 to-cyan-900/90',
    imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&h=600&fit=crop',
    overview: 'The Panama Canal Expansion was one of the most ambitious infrastructure projects of the 21st century. Doubling the canal\'s capacity required sophisticated risk management to handle unprecedented geotechnical challenges, budget constraints, and tight timelines across a 9-year construction period.',
    projectDetails: {
      duration: '2007-2016 (9 years)',
      budget: '$5.4 billion USD',
      location: 'Panama',
      stakeholders: 'Panama Canal Authority, International Contractors, 15+ Countries',
    },
    riskChallenges: [
      'Geotechnical risks in unstable soil conditions',
      'Cost escalation from $5.4B to potential overruns',
      'Complex water management and environmental impacts',
      'Coordination across multiple international contractors',
      'Tight construction timeline with critical path dependencies',
      'Safety risks for 10,000+ workers in hazardous conditions',
    ],
    riskMethodsUsed: [
      'Monte Carlo Simulation - Budget and timeline risk quantification',
      'FMEA (Failure Mode Effects Analysis) - Equipment and process failure analysis',
      'Bow-Tie Analysis - Flood management and structural integrity',
      'Risk Register - Comprehensive tracking of 500+ identified risks',
      'Scenario Planning - Multiple what-if analyses for geological surprises',
    ],
    outcomes: [
      'Project completed successfully with manageable cost overruns',
      '$500M contingency fund effectively managed risks',
      'On-time delivery despite geological challenges',
      'Zero fatal incidents through rigorous safety protocols',
      'Canal capacity doubled, handling Post-Panamax vessels',
    ],
    keyMetrics: [
      { label: 'Risk Events Tracked', value: '500+' },
      { label: 'Simulations Run', value: '10,000+' },
      { label: 'Contingency Used', value: '85%' },
      { label: 'Schedule Variance', value: '+3 months' },
    ],
  },
  {
    id: 'burj-khalifa',
    title: 'Burj Khalifa Construction',
    subtitle: 'FMEA analysis for structural integrity, wind loads, and fire safety',
    riskBadge: '828m Height Risk',
    badgeColor: 'bg-orange-500',
    gradient: 'from-indigo-900/90 to-purple-900/90',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    overview: 'The Burj Khalifa, at 828 meters, redefined what was possible in vertical construction. Risk management was critical for structural safety, wind engineering, fire protection, and coordinating 12,000 workers across 163 floors.',
    projectDetails: {
      duration: '2004-2010 (6 years)',
      budget: '$1.5 billion USD',
      location: 'Dubai, UAE',
      stakeholders: 'Emaar Properties, Samsung C&T, Hyder Consulting',
    },
    riskChallenges: [
      'Unprecedented height creating unique structural challenges',
      'Extreme wind loads at elevation (up to 200 km/h)',
      'Fire safety systems for 163 floors',
      'Concrete pumping to record heights (601m)',
      'Foundation design for seismic stability',
      'Worker safety at extreme elevations',
    ],
    riskMethodsUsed: [
      'FMEA - Risk Priority Numbers (RPN) for structural elements',
      'Wind Tunnel Testing - CFD simulations for aerodynamic design',
      'Finite Element Analysis - Stress testing for extreme loads',
      'Bow-Tie Analysis - Fire safety and evacuation planning',
      'Real-time Monitoring - Sensors for structural health',
    ],
    outcomes: [
      'World\'s tallest structure completed safely',
      'RPN scores reduced from 850 to <100 for critical systems',
      '12,000 workers with exemplary safety record',
      'Fire egress systems validated through 100+ scenarios',
      'Structural integrity maintained through all tests',
    ],
    keyMetrics: [
      { label: 'FMEA Risk Items', value: '1,200+' },
      { label: 'Wind Simulations', value: '40+' },
      { label: 'Safety Audits', value: '500+' },
      { label: 'Concrete Pumped', value: '330,000 m³' },
    ],
  },
  {
    id: 'channel-tunnel',
    title: 'Channel Tunnel (Chunnel)',
    subtitle: 'Bow-Tie analysis for flooding threats and cross-border coordination',
    riskBadge: '50km Subsea Risk',
    badgeColor: 'bg-yellow-500 text-black',
    gradient: 'from-emerald-900/90 to-teal-900/90',
    imageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
    overview: 'The Channel Tunnel connecting England and France was an engineering marvel requiring unprecedented risk management for subsea construction, geological uncertainty, and international coordination across two countries.',
    projectDetails: {
      duration: '1988-1994 (6 years)',
      budget: '£4.65 billion GBP',
      location: 'UK-France Border (English Channel)',
      stakeholders: 'UK & French Governments, Eurotunnel, TML Construction Consortium',
    },
    riskChallenges: [
      'Flooding threats from 50km underwater construction',
      'Geological uncertainty in seabed composition',
      'Cross-border coordination (two governments, languages, standards)',
      'Tunnel boring machine (TBM) failures',
      'Fire safety in confined subsea environment',
      'Political and financial risks across 7-year construction',
    ],
    riskMethodsUsed: [
      'Bow-Tie Analysis - 200+ controls for flooding and collapse scenarios',
      'Geotechnical Risk Assessment - Extensive seabed surveys',
      'Scenario Planning - Multi-country regulatory compliance',
      'Real-time Monitoring - Pressure, water ingress, structural integrity',
      'Emergency Response Planning - Evacuation and rescue protocols',
    ],
    outcomes: [
      'Successfully connected UK and France',
      'Zero breaches despite complex geology',
      '200 preventive and mitigative controls implemented',
      'Tunnel operational for 30+ years',
      'Model for future international megaprojects',
    ],
    keyMetrics: [
      { label: 'Bow-Tie Threats', value: '45' },
      { label: 'Controls Implemented', value: '200+' },
      { label: 'Geological Surveys', value: '120+' },
      { label: 'Emergency Drills', value: '300+' },
    ],
  },
  {
    id: 'iss',
    title: 'International Space Station',
    subtitle: 'Digital Twin monitoring for mission-critical systems in orbit',
    riskBadge: '$150B Program Risk',
    badgeColor: 'bg-purple-500',
    gradient: 'from-slate-900/90 to-zinc-900/90',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
    overview: 'The International Space Station represents the pinnacle of risk management in extreme environments. Digital Twin technology and AI monitoring ensure life support, solar arrays, and critical systems operate flawlessly 400km above Earth.',
    projectDetails: {
      duration: '1998-Present (25+ years)',
      budget: '$150 billion USD',
      location: 'Low Earth Orbit (400km altitude)',
      stakeholders: 'NASA, Roscosmos, ESA, JAXA, CSA, 15 Nations',
    },
    riskChallenges: [
      'Zero-tolerance for failure in life support systems',
      'Micrometeoroid and orbital debris (MMOD) strikes',
      'Solar array degradation and power management',
      'Crew health and safety in microgravity',
      'Resupply mission dependencies',
      'International coordination across 5 space agencies',
    ],
    riskMethodsUsed: [
      'Digital Twin Technology - Real-time virtual replica of all systems',
      'AI-Powered Monitoring - LSTM models for predictive maintenance',
      'FMEA - Criticality analysis for every component',
      'Redundancy Engineering - Backup systems for all critical functions',
      'Continuous Risk Assessment - Daily hazard reviews',
    ],
    outcomes: [
      '25+ years of continuous operation',
      'Zero loss-of-mission events',
      'Real-time monitoring of 1,000+ sensors',
      'Predictive maintenance prevents failures',
      'Model for future space exploration risk management',
    ],
    keyMetrics: [
      { label: 'Sensors Monitored', value: '1,000+' },
      { label: 'Daily Risk Reviews', value: '365/year' },
      { label: 'Redundant Systems', value: '300+' },
      { label: 'Uptime', value: '99.9%' },
    ],
  },
  {
    id: 'three-gorges',
    title: 'Three Gorges Dam',
    subtitle: 'Climate risk modeling for flood management and environmental impact',
    riskBadge: 'Climate Risk Leader',
    badgeColor: 'bg-green-500',
    gradient: 'from-green-900/90 to-lime-900/90',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop',
    overview: 'The Three Gorges Dam is the world\'s largest hydroelectric project, requiring sophisticated climate risk modeling, seismic analysis, and environmental impact assessment across a 600km reservoir spanning the Yangtze River.',
    projectDetails: {
      duration: '1994-2012 (18 years)',
      budget: '$28 billion USD',
      location: 'Yangtze River, China',
      stakeholders: 'Chinese Government, China Yangtze Power, International Consultants',
    },
    riskChallenges: [
      'Climate change impacts on water flow patterns',
      'Seismic risks (dam-induced earthquakes)',
      'Flood management for 600km reservoir',
      'Environmental impact on 1.3 million displaced people',
      'Sediment accumulation affecting capacity',
      'Structural integrity of world\'s largest concrete structure',
    ],
    riskMethodsUsed: [
      'System Dynamics Modeling - Water flow and climate scenarios',
      'Monte Carlo Simulation - Flood risk quantification',
      'Value at Risk (VaR) - Financial impact of climate scenarios',
      'Seismic Hazard Analysis - Probabilistic earthquake modeling',
      'Environmental Impact Assessment - Long-term ecological effects',
    ],
    outcomes: [
      'Flood control protecting 15 million people',
      '22.5 GW power generation (clean energy)',
      'Climate scenario planning guides operations',
      'Seismic monitoring network (100+ stations)',
      'Continuous environmental adaptation',
    ],
    keyMetrics: [
      { label: 'Climate Scenarios', value: '50+' },
      { label: 'VaR Simulations', value: '100,000+' },
      { label: 'Seismic Sensors', value: '100+' },
      { label: 'Power Output', value: '22.5 GW' },
    ],
  },
  {
    id: 'crossrail',
    title: 'London Crossrail (Elizabeth Line)',
    subtitle: 'Portfolio risk analytics for schedule delays and stakeholder management',
    riskBadge: '£4B Over Budget',
    badgeColor: 'bg-red-600',
    gradient: 'from-rose-900/90 to-pink-900/90',
    imageUrl: 'https://images.unsplash.com/photo-1581858745437-65dcb6beb2c7?w=800&h=600&fit=crop',
    overview: 'The Elizabeth Line (Crossrail) is Europe\'s largest infrastructure project, connecting 40 stations across London. Despite going £4B over budget and 3 years late, sophisticated risk management salvaged the project and delivered a transformative transit system.',
    projectDetails: {
      duration: '2009-2022 (13 years)',
      budget: '£18.8 billion GBP (£4B overrun)',
      location: 'London, UK',
      stakeholders: 'Transport for London, UK Government, 100+ Contractors',
    },
    riskChallenges: [
      'Schedule delays compounding across 40 stations',
      'Budget overruns from £14.8B to £18.8B',
      'Urban construction complexity (operating city)',
      'Stakeholder management (100+ contractors)',
      'Technical integration of new/existing infrastructure',
      'Political pressure and public scrutiny',
    ],
    riskMethodsUsed: [
      'Portfolio Risk Analytics - Correlation analysis across work packages',
      'Earned Value Management (EVM) - Cost and schedule performance',
      'Monte Carlo Simulation - Probabilistic completion dates',
      'Stakeholder Risk Register - Managing competing interests',
      'Change Control Process - Mitigating scope creep',
    ],
    outcomes: [
      'Project completed despite major challenges',
      'Portfolio risk analytics identified critical paths',
      'Stakeholder alignment achieved through transparency',
      'Lessons learned for future megaprojects',
      'Transformative impact on London transport',
    ],
    keyMetrics: [
      { label: 'Work Packages', value: '800+' },
      { label: 'Stakeholders', value: '100+' },
      { label: 'Schedule Variance', value: '+3 years' },
      { label: 'Cost Variance', value: '+£4B' },
    ],
  },
];
