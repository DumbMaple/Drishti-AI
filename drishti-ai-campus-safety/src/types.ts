
import {
  CameraFeed,
  Incident,
  ZoneRisk,
  RaipurCampusKey,
} from '../types';

export const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export const DrishtiAPI = {
  async getCameras(_campusKey: RaipurCampusKey = 'ssipmt'): Promise<CameraFeed[]> {
    try {
      const data = await request<any[]>('/cameras');

      return data.map((camera) => ({
        id: String(camera.id),
        name: camera.camera_name,
        zone: camera.location || camera.building,
        status: camera.status?.toLowerCase() === 'online'
          ? 'online'
          : camera.status?.toLowerCase() === 'offline'
            ? 'offline'
            : 'warning',
        aiMode: 'AI Monitoring',
        peopleCount: camera.people_count ?? 0,
        fps: 0,
        resolution: 'Unknown',
        rtspUrl: camera.rtsp_url ?? '',
        lastActive: camera.last_activity ?? camera.created_at ?? '',
        confidence: 0,
        riskLevel: titleCase(camera.risk_level) as CameraFeed['riskLevel'],
      }));
    } catch (error) {
      console.error('Camera API failed:', error);
      return [];
    }
  },

  async getIncidents(_campusKey: RaipurCampusKey = 'ssipmt'): Promise<Incident[]> {
    try {
      const data = await request<any[]>('/incidents/live');

      return data.map((incident) => ({
        id: String(incident.id),
        time: incident.timestamp,
        cameraId: incident.camera_id,
        cameraName: incident.camera_id,
        location: incident.location,
        eventType: incident.event_type as Incident['eventType'],
        severity: titleCase(incident.severity) as Incident['severity'],
        confidence: incident.confidence ?? 0,
        description: incident.description ?? '',
        modelEngine: 'YOLOv8-Crowd',
        status: incident.status as Incident['status'],
      }));
    } catch (error) {
      console.error('Incident API failed:', error);
      return [];
    }
  },

  async acknowledgeIncident(incidentId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE}/incidents/${incidentId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Acknowledged' }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Acknowledge API failed:', error);
      return false;
    }
  },

  async getZones(_campusKey: RaipurCampusKey = 'ssipmt'): Promise<ZoneRisk[]> {
    try {
      const data = await request<any[]>('/risk/zones');

      return data.map((zone, index) => ({
        id: String(index + 1),
        name: zone.zone,
        riskScore: zone.risk_score,
        status: titleCase(zone.status) as ZoneRisk['status'],
        camerasCount: zone.cameras,
        alertsCount: 0,
        activeIncidents: [],
      }));
    } catch (error) {
      console.error('Risk zones API failed:', error);
      return [];
    }
  },

  subscribeLiveFeed(
    onIncident: (incident: Incident) => void,
    onMetricsUpdate?: (data: any) => void
  ): () => void {
    const wsUrl =
      (import.meta as any).env?.VITE_WS_URL ||
      'ws://127.0.0.1:8000/ws/alerts';

    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === 'INCIDENT' && payload.data) {
            onIncident(payload.data);
          }

          if (payload.type === 'METRICS' && onMetricsUpdate) {
            onMetricsUpdate(payload.data);
          }
        } catch (error) {
          console.warn('WebSocket message parsing failed:', error);
        }
      };

      ws.onerror = () => {
        console.warn('Drishti AI WebSocket connection failed.');
      };
    } catch (error) {
      console.warn('WebSocket unavailable:', error);
    }

    return () => {
      ws?.close();
    };
  },
};
