export interface BuildingInfo {
  id: string;
  name: string;
  code: string;
  category: 'academic' | 'administrative' | 'residential' | 'amenity' | 'sports';
  floorCount: number;
  description: string;
  facilities: string[];
  directionsFromMainGate: string;
  cameraIds: string[];
  riskStatus: 'Safe' | 'Moderate' | 'Critical';
}

export const SSIPMT_BUILDINGS: Record<string, BuildingInfo> = {
  temple: {
    id: 'temple',
    name: 'Campus Temple (Shri Shankaracharya Mandir)',
    code: 'TMP-01',
    category: 'amenity',
    floorCount: 1,
    description: 'Serene spiritual temple and sacred plaza located on the western boundary near the Main Gate.',
    facilities: ['Prayer & Meditation Hall', 'Peace Garden', 'Heritage Chhatri'],
    directionsFromMainGate: 'Immediately on your left upon entering through the Main Gate.',
    cameraIds: ['CAM-002'],
    riskStatus: 'Safe'
  },
  basketball_court: {
    id: 'basketball_court',
    name: 'Basketball Court & Sports Arena',
    code: 'SPT-01',
    category: 'sports',
    floorCount: 1,
    description: 'Regulation-size illuminated outdoor basketball court and student recreational sports arena.',
    facilities: ['Floodlit Basketball Hardcourt', 'Bleachers', 'Equipment Lockers'],
    directionsFromMainGate: 'Walk straight past the Main Gate for 25 meters; the basketball court is situated on your left next to the temple.',
    cameraIds: ['CAM-009'],
    riskStatus: 'Safe'
  },
  boys_hostel: {
    id: 'boys_hostel',
    name: 'Boys Hostel',
    code: 'HST-B',
    category: 'residential',
    floorCount: 4,
    description: 'Dedicated residential facility for male students with in-house dining mess, Wi-Fi, and recreation rooms.',
    facilities: ['Dining Mess Hall', 'Indoor Games & TV Lounge', 'Warden Quarters', 'Biometric Gate'],
    directionsFromMainGate: 'Follow the campus avenue past the basketball court. The Boys Hostel is the multi-story block on the left with access to the back road.',
    cameraIds: ['CAM-004'],
    riskStatus: 'Safe'
  },
  management_block: {
    id: 'management_block',
    name: 'Management Block (MBA & First Year)',
    code: 'MGT-01',
    category: 'academic',
    floorCount: 3,
    description: 'Houses the Department of Management Studies (MBA), executive seminar halls, and first-year classrooms.',
    facilities: ['MBA Lecture Theaters', 'Smart Seminar Hall', 'Faculty Cabin Suites', 'Case Study Room'],
    directionsFromMainGate: 'Situated directly between the Boys Hostel and the Admin Block along the main campus avenue.',
    cameraIds: ['CAM-005'],
    riskStatus: 'Safe'
  },
  admin: {
    id: 'admin',
    name: 'Admin Block (Central Administration)',
    code: 'ADM-01',
    category: 'administrative',
    floorCount: 3,
    description: 'Administrative nerve center housing the Principal’s Office, Registrar, Accounts Counter, and Central Examination Cell.',
    facilities: ["Principal's Office", 'Central Examination Cell', 'Student Section & Accounts', 'TPO Cell', 'Board Room'],
    directionsFromMainGate: 'Proceed straight along the main avenue for 75 meters. The central Admin Block stands prominently between the Management Block and the Academic Block.',
    cameraIds: ['CAM-006', 'CAM-008'],
    riskStatus: 'Safe'
  },
  academic_block: {
    id: 'academic_block',
    name: 'Academic Block (Engineering Departments)',
    code: 'ACAD-01',
    category: 'academic',
    floorCount: 4,
    description: 'Core engineering classrooms, departmental laboratories (CSE, IT, Mech, Civil, EE), and computing centers.',
    facilities: ['Computing & AI Labs', 'Electronics & Microcontroller Lab', 'Civil Engineering Testing Studio', 'Smart Lecture Halls'],
    directionsFromMainGate: 'Located adjacent to the Admin Block on the right side of the main avenue, directly opposite the parking road.',
    cameraIds: ['CAM-001', 'CAM-005'],
    riskStatus: 'Moderate'
  },
  medical: {
    id: 'medical',
    name: 'Medical Room & Health Dispensary',
    code: 'MED-01',
    category: 'amenity',
    floorCount: 1,
    description: 'Campus healthcare facility staffed with registered medical personnel and 24/7 on-call ambulance connectivity.',
    facilities: ['First Aid & Emergency Beds', 'Consulting Doctor Chamber', 'Essential Medicines Dispensary', 'Ambulance Parking Bay'],
    directionsFromMainGate: 'Located along the back road, directly behind the Academic and Admin blocks.',
    cameraIds: ['CAM-007'],
    riskStatus: 'Safe'
  },
  parking: {
    id: 'parking',
    name: 'Vehicle Parking Area',
    code: 'PRK-01',
    category: 'amenity',
    floorCount: 1,
    description: 'Designated shaded parking bays for student two-wheelers, faculty four-wheelers, and college transit buses.',
    facilities: ['Two-Wheeler Covered Shed', 'Faculty Car Shed', 'College Bus Depot', 'ANPR Cameras'],
    directionsFromMainGate: 'Situated along the main road corridor between the Academic Block and the New Building.',
    cameraIds: ['CAM-003'],
    riskStatus: 'Critical'
  },
  canteen: {
    id: 'canteen',
    name: 'Campus Canteen & Cafeteria',
    code: 'CAN-01',
    category: 'amenity',
    floorCount: 1,
    description: 'Spacious dining pavilion serving breakfast, lunch meals, evening tea, fresh snacks, and student lounge.',
    facilities: ['Dining Hall (300 Capacity)', 'Outdoor Patio', 'Snack & Beverage Counter', 'Juice Bar'],
    directionsFromMainGate: 'Located near the back road at the end of the parking corridor, adjacent to the Girls Hostel.',
    cameraIds: ['CAM-011'],
    riskStatus: 'Moderate'
  },
  new_building: {
    id: 'new_building',
    name: 'New Building (Extension Block & IDEA Lab)',
    code: 'NEW-01',
    category: 'academic',
    floorCount: 4,
    description: 'Modern extension building housing the AICTE IDEA Lab, state-of-the-art research centers, and seminar halls.',
    facilities: ['AICTE IDEA Prototyping Lab', 'Advanced Robotics Studio', 'Auditorium', 'Startup Incubator'],
    directionsFromMainGate: 'Proceed along the main avenue past the parking road. The New Building is on the right flank next to the Girls Hostel.',
    cameraIds: ['CAM-010'],
    riskStatus: 'Safe'
  },
  girls_hostel: {
    id: 'girls_hostel',
    name: 'Girls Hostel',
    code: 'HST-G',
    category: 'residential',
    floorCount: 3,
    description: 'Secure, dedicated residential hostel for female students with gated boundary, round-the-clock female security, and dining mess.',
    facilities: ['Dining Mess', 'Common Recreation Hall', 'Warden Office', 'Biometric Curfew Gate'],
    directionsFromMainGate: 'Situated at the far right corner of the campus, behind the New Building and adjacent to the Canteen.',
    cameraIds: ['CAM-007'],
    riskStatus: 'Critical'
  }
};

export const SSIPMT_CAMPUS_INFO = {
  fullName: 'Shri Shankaracharya Institute of Professional Management & Technology (SSIPMT)',
  location: 'Old Dhamtari Road, P.O. Sejbahar, Mujgahan, Raipur, Chhattisgarh - 492015',
  oppositeLandmark: 'Opposite Planet City, Mujgahan',
  affiliation: 'Affiliated to CSVTU Bhilai & Approved by AICTE, New Delhi',
  accreditation: 'NAAC Accredited Grade A Institution',
  keyTimings: {
    campusHours: '8:30 AM to 5:00 PM (Monday to Saturday)',
    classes: '9:00 AM to 4:30 PM',
    library: '8:30 AM to 6:30 PM (Reading hall open till 8:00 PM during exams)',
    canteen: '8:00 AM to 7:00 PM',
    hostelCurfew: '7:30 PM sharp for all residential hostel students'
  },
  emergencyContacts: [
    { title: 'Campus Security Control Room', phone: '+91 771 277 2989', ext: '101' },
    { title: 'Chief Proctor & Discipline Cell', phone: '+91 98261 44521' },
    { title: 'Campus Medical Dispensary & Ambulance', phone: '+91 771 277 2990', ext: '108' },
    { title: 'Women Safety / Anti-Ragging Cell', phone: '+91 94252 09876' },
    { title: 'Training & Placement Officer (TPO)', phone: '+91 98263 11234' }
  ],
  managementStats: {
    totalStudents: '3,200+',
    totalFaculty: '185+',
    totalCctvCameras: 128,
    activeSecurityGuards: 24,
    aiVisionEngines: 'YOLOv8 Edge + MediaPipe Pose + DeepSORT Multi-Camera Tracking'
  }
};
