export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    PROFILE: "/auth/profile",
  },
  CONTACT: {
    SUBMIT: "/contact/submit",
  },
  MEMBERSHIP: {
    REGISTER: "/membership/register",
    LIST: "/assessors",
    VERIFY: (id) => `/assessors/${id}/verify`,
    DELETE: (id) => `/assessors/${id}`,
  },
  CONTENT: {
    GET: "/content",
    UPDATE: "/content",
  },
  MESSAGES: {
    LIST: "/messages",
    READ: (id) => `/messages/${id}/read`,
    DELETE: (id) => `/messages/${id}`,
  },
  ACTIVITIES: {
    LIST: "/activities",
    CREATE: "/activities",
    UPDATE: (id) => `/activities/${id}`,
    DELETE: (id) => `/activities/${id}`,
  }
};
