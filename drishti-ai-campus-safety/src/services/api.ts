import { CameraFeed, Incident, ZoneRisk, RaipurCampusKey } from '../types';
import { INITIAL_CAMERAS, INITIAL_INCIDENTS, INITIAL_ZONES, RAIPUR_CAMPUSES } from '../data/mockData';

// ============================================================================
// DRISHTI AI — BACKEND INTEGRATION SERVICE LAYER
// Your teammate can replace these functions with real REST API calls or WebSockets
// Example: fetch(`${API_BASE}/cameras`).then(res => res.json())
// ============================================================================

export const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export const DrishtiAPI = {
  // 1. Fetch live cameras for a selected campus
  async getCameras(campusKey: RaipurCampusKey = 'ssipmt'): Promise<CameraFeed[]> {
    try {
      const res = await fetch(`${API_BASE}/campuses/${campusKey}/cameras`);
      if (!res.ok) throw new Error('Backend not connected');
      return await res.json();
    } catch {
      // Graceful fallback to client state if backend is offline
      return INITIAL_CAMERAS;
    }
  },

  // 2. Fetch active security incidents (YOLO/Vision Model detections)
  async getIncidents(campusKey: RaipurCampusKey = 'ssipmt'): Promise<Incident[]> {
    try {
      const res = await fetch(`${API_BASE}/campuses/${campusKey}/incidents`);
      if (!res.ok) throw new Error('Backend not connected');
      return await res.json();
    } catch {
      return INITIAL_INCIDENTS;
    }
  },

  // 3. Acknowledge an incident alert
  async acknowledgeIncident(incidentId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/incidents/${incidentId}/ack`, { method: 'POST' });
      return res.ok;
    } catch {
      return true;
    }
  },

  // 4. Fetch Campus Zone Risk Saturation
  async getZones(campusKey: RaipurCampusKey = 'ssipmt'): Promise<ZoneRisk[]> {
    try {
      const res = await fetch(`${API_BASE}/campuses/${campusKey}/zones`);
      if (!res.ok) throw new Error('Backend not connected');
      return await res.json();
    } catch {
      return INITIAL_ZONES;
    }
  },

  // 5. Connect to Live WebSocket for real-time model detections
  // Usage by your teammate:
  // DrishtiAPI.subscribeLiveFeed((detection) => { ... })
  subscribeLiveFeed(
    onIncident: (incident: Incident) => void,
    onMetricsUpdate?: (data: any) => void
  ): () => void {
    const wsUrl = (import.meta as any).env?.VITE_WS_URL || `ws://${window.location.host}/ws/detections`;
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'INCIDENT') onIncident(payload.data);
          if (payload.type === 'METRICS' && onMetricsUpdate) onMetricsUpdate(payload.data);
        } catch (e) {
          console.warn('WS parse error', e);
        }
      };
    } catch (err) {
      console.info('Running in standalone client mode (WebSocket offline).');
    }

    // Return cleanup unsubscribe function
    return () => {
      if (ws) ws.close();
    };
  }
};
