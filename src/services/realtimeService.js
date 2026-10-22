import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStatusMeta } from '../utils/statusHelper';

class RealtimeService {
  constructor() {
    this.subscribers = new Set();
    this.connectionStatus = isSupabaseConfigured ? 'connecting' : 'local_ready';
    this.broadcastChannel = null;
    this.supabaseChannel = null;

    this.init();
  }

  init() {
    // 1. Setup Cross-Tab Broadcast Channel (instant local/multi-tab sync)
    if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('urgut_mebel_realtime_bus');
        this.broadcastChannel.onmessage = (e) => {
          if (e.data) {
            this.handleIncomingEvent({ source: 'broadcast_channel', ...e.data });
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported or error:', err);
      }
    }

    // 2. Setup Supabase WebSocket Realtime Channel
    if (isSupabaseConfigured && supabase) {
      try {
        this.supabaseChannel = supabase
          .channel('urgut_mebel_realtime_global', {
            config: {
              broadcast: { self: false }
            }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_orders' }, (payload) => {
            this.handleIncomingEvent({
              source: 'supabase_postgres',
              type: 'CUSTOM_ORDER_CHANGED',
              table: 'custom_orders',
              payload
            });
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
            this.handleIncomingEvent({
              source: 'supabase_postgres',
              type: 'ORDER_CHANGED',
              table: 'orders',
              payload
            });
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
            this.handleIncomingEvent({
              source: 'supabase_postgres',
              type: 'PRODUCT_CHANGED',
              table: 'products',
              payload
            });
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'discount_requests' }, (payload) => {
            this.handleIncomingEvent({
              source: 'supabase_postgres',
              type: 'DISCOUNT_REQUEST_CHANGED',
              table: 'discount_requests',
              payload
            });
          })
          .on('broadcast', { event: 'realtime_event' }, ({ payload }) => {
            this.handleIncomingEvent({
              source: 'supabase_ws_broadcast',
              ...payload
            });
          })
          .subscribe((status, err) => {
            console.info('🔌 WebSocket Realtime Status:', status);
            this.connectionStatus = status;
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('urgut_ws_status_change', { detail: status }));
            }
          });
      } catch (err) {
        console.error('Supabase Realtime Channel init error:', err);
      }
    } else {
      this.connectionStatus = 'local_bus_active';
    }

    // 3. Listen to local window storage events
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('urgut_mebel_')) {
          const entity = e.key.replace('urgut_mebel_', '');
          this.handleIncomingEvent({
            source: 'storage_sync',
            type: 'ENTITY_MUTATED',
            entity
          });
        }
      });
    }
  }

  /**
   * Broadcast an event to all connected clients & tabs
   * @param {Object} eventData
   */
  broadcast(eventData) {
    const enriched = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...eventData
    };

    // 1. Broadcast over Supabase WebSocket
    if (this.supabaseChannel && this.connectionStatus === 'SUBSCRIBED') {
      try {
        this.supabaseChannel.send({
          type: 'broadcast',
          event: 'realtime_event',
          payload: enriched
        }).catch((err) => {
          console.warn('Supabase WS broadcast failed, using local bus:', err);
        });
      } catch (e) {
        console.warn('Supabase send error:', e);
      }
    }

    // 2. Broadcast over Browser Tab Channel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(enriched);
      } catch (e) {
        console.warn('BroadcastChannel postMessage error:', e);
      }
    }

    // 3. Notify local subscribers
    this.handleIncomingEvent({ source: 'local_emitter', ...enriched });
  }

  /**
   * Process and forward incoming event to all active listeners
   */
  handleIncomingEvent(event) {
    // Notify all active React subscribers
    this.subscribers.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error('Subscriber callback error in RealtimeService:', err);
      }
    });

    // Dispatch global custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('urgut_realtime_event', { detail: event }));
    }
  }

  /**
   * Subscribe to real-time events
   * @param {Function} callback 
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Play subtle synthesized notification chime (Web Audio API)
   * No external mp3 file required
   */
  playNotificationSound(type = 'status') {
    try {
      if (typeof window === 'undefined') return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'order') {
        // High celebratory two-tone ping for new orders
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
      } else {
        // Subtle status change chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.09); // E5
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch (e) {
      // Audio autoplay restrictions or headless env
    }
  }

  /**
   * Helper to format bilingual notifications
   */
  formatStatusChangeMessage(orderNumber, newStatus, entityType = 'Maxsus buyurtma') {
    const meta = getStatusMeta(newStatus, 'bilingual');
    return {
      titleUz: `${entityType} holati o‘zgardi!`,
      titleEn: 'Order status updated!',
      messageUz: `№ ${orderNumber} holati: ${meta.labelUz}`,
      messageEn: `Order #${orderNumber} is now: ${meta.labelEn}`,
      bilingual: `№ ${orderNumber} • ${meta.bilingual}`,
      meta
    };
  }
}

export const realtimeService = new RealtimeService();
