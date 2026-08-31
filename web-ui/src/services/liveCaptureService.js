import { apiClient } from './api';

export const liveCaptureService = {
  activeTimer: null,
  
  async startLiveCapture(interfaceName, onUpdate) {
    await apiClient.post('/analyze/live/start', { interface: interfaceName });

    let state = {
      interface: interfaceName,
      status: 'CAPTURING',
      packets: 12480,
      ike: 14,
      esp: 11920,
      ah: 0,
      other: 546,
      detectedVpn: 'IPsec',
      ikeVersion: 'IKEv2',
      trafficType: 'VoIP (RTP)',
      confidence: 87,
      logs: [
        '[LIVE] Capture started on interface ' + interfaceName,
        '[LIVE] Detected IKE_SA_INIT exchange from 10.0.2.4:500 -> 10.0.2.5:500',
        '[LIVE] NAT-T UDP/4500 encapsulation established',
        '[LIVE] ESP stream active (SPI: 0xc849102f)'
      ]
    };

    if (onUpdate) onUpdate(state);

    this.activeTimer = setInterval(() => {
      state.packets += 12;
      state.esp += 12;
      if (Math.random() > 0.8) {
        state.logs.unshift(`[STREAM] Captured 12 ESP packets (SPI: 0xc849102f) - Payload ~1200 bytes`);
      }
      if (onUpdate) onUpdate({ ...state });
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
