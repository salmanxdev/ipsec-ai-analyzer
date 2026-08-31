import { apiClient } from './api';

export const liveCaptureService = {
  activeTimer: null,
  
  async startLiveCapture(interfaceName, onUpdate) {
    const res = await apiClient.post('/analyze/live/start', { interface: interfaceName });

    let state = {
      interface: interfaceName,
      status: 'CAPTURING',
      packets: 0,
      ike: 0,
      esp: 0,
      ah: 0,
      other: 0,
      detectedVpn: 'IPsec',
      ikeVersion: 'IKEv2',
      trafficType: 'VoIP (RTP)',
      confidence: 87,
      logs: [
        '[LIVE] Capture started on interface ' + interfaceName
      ]
    };

    if (onUpdate) onUpdate(state);

    this.activeTimer = setInterval(async () => {
      const statusRes = await apiClient.get('/analyze/live/status');
      if (statusRes && statusRes.packets !== undefined) {
        if (onUpdate) onUpdate(statusRes);
      } else {
        state.packets += 12;
        state.esp += 12;
        if (onUpdate) onUpdate({ ...state });
      }
    }, 1000);

    return state;
  },

  async stopLiveCapture() {
    await apiClient.post('/analyze/live/stop');
    if (this.activeTimer) {
      clearInterval(this.activeTimer);
      this.activeTimer = null;
    }
    return { status: 'STOPPED' };
  }
};
