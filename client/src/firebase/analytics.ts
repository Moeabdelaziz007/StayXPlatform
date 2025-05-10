import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

export const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  } else {
    console.warn('Analytics not initialized, skipping event tracking');
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || pagePath,
  });
};

export const trackUserSignUp = (method: string) => {
  trackEvent('sign_up', {
    method,
  });
};

export const trackUserLogin = (method: string) => {
  trackEvent('login', {
    method,
  });
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};

export const trackConnection = (connectionType: 'send_request' | 'accept' | 'reject') => {
  trackEvent('connection', {
    connection_type: connectionType,
  });
};

export const trackMessageSent = () => {
  trackEvent('message_sent');
};

export const trackAchievementEarned = (achievementName: string) => {
  trackEvent('achievement_earned', {
    achievement_name: achievementName,
  });
};

export const trackFeatureUsage = (featureName: string) => {
  trackEvent('feature_used', {
    feature_name: featureName,
  });
};

export const trackProfileUpdate = (fieldName: string) => {
  trackEvent('profile_update', {
    field_name: fieldName,
  });
};

export const trackError = (errorMessage: string, errorCode?: string) => {
  trackEvent('app_error', {
    error_message: errorMessage,
    error_code: errorCode,
  });
};
