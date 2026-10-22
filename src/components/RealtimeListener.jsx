import React, { useEffect } from 'react';
import { realtimeService } from '../services/realtimeService';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { getStatusMeta } from '../utils/statusHelper';

export const RealtimeListener = () => {
  const { addToast } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    // Subscribe to all incoming WebSocket and Broadcast realtime events
    const unsubscribe = realtimeService.subscribe((event) => {
      if (!event || !event.type) return;

      switch (event.type) {
        case 'CUSTOM_ORDER_STATUS_CHANGED': {
          realtimeService.playNotificationSound('status');
          const meta = getStatusMeta(event.newStatus, 'bilingual');
          addToast(
            `⚡ Buyurtma holati yangilandi / Status updated: № ${event.orderNumber || ''} • ${meta.bilingual}`,
            'info',
            5500
          );
          break;
        }

        case 'CUSTOM_ORDER_CREATED': {
          // Play sound and show toast
          realtimeService.playNotificationSound('order');
          addToast(
            `🔔 Yangi maxsus buyurtma qabul qilindi! / New Custom Order: № ${event.orderNumber || ''} (${event.customerName || 'Mijoz'})`,
            'success',
            6000
          );
          break;
        }

        case 'ORDER_STATUS_CHANGED': {
          realtimeService.playNotificationSound('status');
          const meta = getStatusMeta(event.newStatus, 'bilingual');
          addToast(
            `⚡ Xarid buyurtmasi yangilandi / Order updated: № ${event.orderNumber || ''} • ${meta.bilingual}`,
            'info',
            5500
          );
          break;
        }

        case 'ORDER_CREATED': {
          realtimeService.playNotificationSound('order');
          addToast(
            `🛒 Yangi xarid buyurtmasi tushdi! / New Store Order: № ${event.orderNumber || ''}`,
            'success',
            6000
          );
          break;
        }

        case 'PRICE_OFFER_SENT': {
          realtimeService.playNotificationSound('status');
          addToast(
            `💰 Buyurtma uchun narx taklifi tayyorlandi! / Price proposal ready: № ${event.orderNumber || ''}`,
            'warning',
            6000
          );
          break;
        }

        case 'DISCOUNT_REQUEST_SUBMITTED': {
          if (user && (user.role === 'admin' || user.role === 'manager')) {
            realtimeService.playNotificationSound('status');
            addToast(
              `🏷️ Do‘kondan yangi chegirma so‘rovi kelib tushdi! / New discount request submitted`,
              'info',
              6000
            );
          }
          break;
        }

        case 'DISCOUNT_REQUEST_APPROVED': {
          realtimeService.playNotificationSound('order');
          addToast(
            `🎉 Chegirma aksiyasi ma’qullandi! / Discount request approved & published`,
            'success',
            5500
          );
          break;
        }

        default:
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [addToast, user]);

  return null;
};
