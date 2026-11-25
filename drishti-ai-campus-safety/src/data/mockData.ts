import { RaipurCampusKey, CampusTelemetry, CameraFeed, Incident, ZoneRisk } from '../types';

export const RAIPUR_CAMPUSES: Record<RaipurCampusKey, CampusTelemetry> = {
  ssipmt: {
    id: "CG-RPR-01",
    name: "SSIPMT Raipur (Shri Shankaracharya)",
    shortName: "SSIPMT Raipur",
    location: "Old Dhamtari Road, Mujgahan, Raipur",
    status: "SECURE",
    cams: 128,
    activeCams: 124,
    crowdSaturation: "Moderate (54%)",
    crowdPct: 54,
    breaches: 0,
    falls: 0,
    safetyScore: 94,
    desc: "Primary monitored campus featuring dedicated academic wings, AICTE IDEA lab, heavy engineering workshops, and residential hostels under active neural vision."
  },
  nit: {
    id: "CG-RPR-02",
    name: "NIT Raipur (National Institute of Technology)",
    shortName: "NIT Raipur",
    location: "Great Eastern Road, Raipur",
    status: "OPTIMAL",
    cams: 184,
    activeCams: 180,
    crowdSaturation: "Moderate (48%)",
    crowdPct: 48,
    breaches: 0,
    falls: 0,
    safetyScore: 96,
    desc: "G.E. Road main campus connecting Central Computer Center, Architecture department, and student hostel perimeters with automated turnstile verification."
  },
  iiit: {
    id: "CG-RPR-03",
    name: "IIIT Naya Raipur (Dr. SPM IIIT-NR)",
    shortName: "IIIT Naya Raipur",
    location: "Sector 24, Atal Nagar, Naya Raipur",
    status: "OPTIMAL",
    cams: 156,
    activeCams: 154,
    crowdSaturation: "Low (32%)",
    crowdPct: 32,
    breaches: 0,
    falls: 0,
    safetyScore: 98,
    desc: "Smart modern tech campus in Atal Nagar featuring automated biometric access, smart classrooms, and 4K optical perimeter tripwires."
  },
  aiims: {
    id: "CG-RPR-04",
    name: "AIIMS Raipur (Medical Sciences)",
    shortName: "AIIMS Raipur",
    location: "Tatibandh, GE Road, Raipur",
    status: "CROWD ALERT",
    cams: 210,
    activeCams: 202,
    crowdSaturation: "High (79%)",
    crowdPct: 79,
    breaches: 1,
    falls: 2,
    safetyScore: 89,
    desc: "Major healthcare and medical teaching hospital complex with active patient fall detection, emergency department crowd monitoring, and ambulance bays."
  },
  hnlu: {
    id: "CG-RPR-05",
    name: "HNLU Raipur (National Law University)",
    shortName: "HNLU Raipur",
    location: "Uparwara, Naya Raipur",
    status: "SECURE",
    cams: 92,
    activeCams: 90,
    crowdSaturation: "Low (26%)",
    crowdPct: 26,
    breaches: 0,
    falls: 0,
    safetyScore: 97,
    desc: "Spacious residential law campus with strict gate access, moot court complex, and continuous residential hostel perimeter oversight."
  },
  prsu: {
    id: "CG-RPR-06",
    name: "Pt. Ravishankar Shukla University (PRSU)",
    shortName: "PRSU Raipur",
    location: "Amanaka, Raipur",
    status: "SECURE",
    cams: 140,
    activeCams: 136,
    crowdSaturation: "Normal (41%)",
    crowdPct: 41,
    breaches: 0,
    falls: 0,
    safetyScore: 93,
    desc: "State university main campus with university library, administrative towers, science departments, and sports stadium grounds."
  }
};

// Aliases for compatibility
export const CAMPUS_DATA = RAIPUR_CAMPUSES;

export const INITIAL_ZONES: ZoneRisk[] = [
  {
    id: "zone-1",
    name: "Main Gate",
    riskScore: 42,
    status: "Safe",
    camerasCount: 2,
    alertsCount: 0,
    activeIncidents: []
  },
  {
    id: "zone-2",
    name: "Library",
    riskScore: 12,
    status: "Safe",
    camerasCount: 1,
    alertsCount: 0,
    activeIncidents: []
  },
  {
    id: "zone-3",
    name: "Parking Area",
    riskScore: 86,
    status: "Critical",
    camerasCount: 5,
    alertsCount: 6,
    activeIncidents: ["Abnormal Activity in Transformer Bay", "Unauthorized Vehicle Idle"]
  },
  {
    id: "zone-4",
    name: "Hostel A",
    riskScore: 78,
    status: "Critical",
    camerasCount: 3,
    alertsCount: 4,
    activeIncidents: ["Fall Distress in Staircase 2B", "Curfew Breach Warning"]
  },
  {
    id: "zone-5",
    name: "Hostel B",
    riskScore: 24,
    status: "Safe",
    camerasCount: 2,
    alertsCount: 0,
    activeIncidents: []
  },
  {
    id: "zone-6",
    name: "Academic Block",
    riskScore: 52,
    status: "Moderate",
    camerasCount: 4,
    alertsCount: 2,
    activeIncidents: ["Crowd Surge outside Lecture Hall 3"]
  },
  {
    id: "zone-7",
    name: "Admin Building",
    riskScore: 21,
    status: "Safe",
    camerasCount: 2,
    alertsCount: 0,
    activeIncidents: []
  },
  {
    id: "zone-8",
    name: "Examination Cell",
    riskScore: 85,
    status: "Critical",
    camerasCount: 3,
    alertsCount: 5,
    activeIncidents: ["Restricted Zone Proximity Alert", "Unscheduled Door Sensor Trigger"]
  }
];

export const INITIAL_CAMERAS: CameraFeed[] = [
  {
    id: "CAM-001",
    name: "Library Entrance",
    zone: "Library",
    status: "online",
    aiMode: "AI DETECTION ACTIVE",
    peopleCount: 8,
    fps: 30,
    resolution: "4K UHD (3840x2160)",
    rtspUrl: "rtsp://ssipmt-hub.drishti.local:554/cam001_h265",
    lastActive: "12:44 PM",
    confidence: 98.6,
    riskLevel: "Safe"
  },
  {
    id: "CAM-002",
    name: "Main Gate",
    zone: "Main Gate",
    status: "online",
    aiMode: "CROWD MONITORING",
    peopleCount: 34,
    fps: 30,
    resolution: "1080p (1920x1080)",
    rtspUrl: "rtsp://ssipmt-hub.drishti.local:554/cam002_h265",
    lastActive: "12:45 PM",
    confidence: 89.2,
    riskLevel: "Moderate"
  },
  {
    id: "CAM-003",
    name: "Parking Lot",
    zone: "Parking Area",
    status: "alert",
    aiMode: "ANOMALY DETECTED",
    peopleCount: 3,
    fps: 25,
    resolution: "4K UHD (3840x2160)",
    rtspUrl: "rtsp://ssipmt-hub.drishti.local:554/cam003_h265",
    lastActive: "12:46 PM",
    confidence: 95.8,
    riskLevel: "Critical"
  },
  {
    id: "CAM-004",
    name: "Hostel Corridor",
    zone: "Hostel A",
    status: "online",
    aiMode: "ZONE MONITORING",
    peopleCount: 2,
    fps: 30,
    resolution: "1080p (1920x1080)",
    rtspUrl: "rtsp://ssipmt-hub.drishti.local:554/cam004_h265",
    lastActive: "12:43 PM",
    confidence: 94.1,
    riskLevel: "Safe"
  },
  {
    id: "CAM-005",
    name: "Academic Block",
    zone: "Academic Block",
    status: "warning",
    aiMode: "CROWD MONITORING",
    peopleCount: 28,
    fps: 30,
    resolution: "1080p (1920x1080)",
    rtspUrl: "rtsp://ssipmt-hub.drishti.local:554/cam005_h265",
    lastActive: "12:44 PM",
    confidence: 88.7,
    riskLevel: "Moderate"
  },
  {
    id: "CAM-006",
    name: "Admin Building",
    zone: "Admin Building",
    status: "online",
    aiMode: "IR DETECTION ACTIVE",
    peopleCount: 4,
    fps: 30,
    resolution: "1080p (1920x1080)",
    rtspUrl: "rtsp://ssipmt-hub.drishti.local:554/cam006_h265",
    lastActive: "12:42 PM",
    confidence: 96.2,
    riskLevel: "Safe"
  },
  {
    id: "CAM-007",
    name: "Hostel A Staircase",
    zone: "Hostel A",
    status: "alert",
    aiMode: "FALL DETECTION ACTIVE",
    peopleCount: 1,
    fps: 30,
    resolution: "4K UHD (3840x2160)",
    rtspUrl: "rtsp://ssipmt-hub.drishti.local:554/cam007_h265",
    lastActive: "12:46 PM",
    confidence: 94.8,
    riskLevel: "Critical"
  },
  {
    id: "CAM-008",
    name: "Examination Cell Corridor",
    zone: "Examination Cell",
    status: "alert",
    aiMode: "PERIMETER SHIELD",
    peopleCount: 2,
    fps: 30,
    resolution: "4K UHD (3840x2160)",
    rtspUrl: "rtsp://ssipmt-hub.drishti.local:554/cam008_h265",
    lastActive: "12:45 PM",
    confidence: 97.1,
    riskLevel: "Critical"
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "INC-8941",
    time: "08:14 pm",
    cameraId: "CAM-007",
    cameraName: "Hostel A Staircase",
    location: "Hostel A",
    eventType: "Fall Detection",
    severity: "Critical",
    confidence: 93.8,
    description: "Sudden human posture collapse detected via MediaPipe Pose (ground contact confirmed > 4s)",
    modelEngine: "MediaPipe Pose",
    status: "Pending"
  },
  {
    id: "INC-8940",
    time: "06:22 pm",
    cameraId: "CAM-001",
    cameraName: "Library Entrance",
    location: "Library",
    eventType: "Fall Detection",
    severity: "Critical",
    confidence: 95.5,
    description: "Rapid vertical velocity drop with sustained stillness detected at entrance stairs",
    modelEngine: "MediaPipe Pose",
    status: "Acknowledged"
  },
  {
    id: "INC-8939",
    time: "05:12 pm",
    cameraId: "CAM-002",
    cameraName: "Main Gate",
    location: "Main Gate",
    eventType: "Crowd Alert",
    severity: "Moderate",
    confidence: 91.4,
    description: "Gate crowd surge (density threshold > 30 persons/100m² triggered)",
    modelEngine: "YOLOv8-Crowd",
    status: "Acknowledged"
  },
  {
    id: "INC-8938",
    time: "04:30 pm",
    cameraId: "CAM-005",
    cameraName: "Academic Block",
    location: "Academic Block",
    eventType: "Crowd Alert",
    severity: "Moderate",
    confidence: 88.7,
    description: "Dense gathering detected outside lecture hall corridor during class interchange",
    modelEngine: "YOLOv8-Crowd",
    status: "Acknowledged"
  },
  {
    id: "INC-8937",
    time: "03:15 pm",
    cameraId: "CAM-008",
    cameraName: "Examination Cell Corridor",
    location: "Examination Cell",
    eventType: "Unauthorized Entry",
    severity: "Critical",
    confidence: 96.4,
    description: "Unauthorized perimeter breach: badge reader bypassed in secure examination storage",
    modelEngine: "DeepSORT-Track",
    status: "Dispatched"
  },
  {
    id: "INC-8936",
    time: "01:45 pm",
    cameraId: "CAM-003",
    cameraName: "Parking Lot",
    location: "Parking Area",
    eventType: "Abnormal Activity",
    severity: "Moderate",
    confidence: 95.8,
    description: "Prolonged loitering detected near high-voltage transformer substation bay",
    modelEngine: "YOLOv8x-Thermal",
    status: "Pending"
  }
];
