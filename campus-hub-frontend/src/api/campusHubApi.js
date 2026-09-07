import api from './axiosInstance';

const listLostFound = async (params = {}) => (await api.get('/lost-found', { params })).data;
const reportLostFound = async (payload) => (await api.post('/lost-found', payload)).data;
const listReviews = async (committeeId) => (await api.get(`/reviews/committee/${committeeId}`)).data;
const submitReview = async (payload) => (await api.post('/reviews', payload)).data;
const getLostFoundSummary = async () => (await api.get('/lost-found/summary')).data;
const getAnalyticsOverview = async () => (await api.get('/analytics/overview')).data;

export {
  listLostFound,
  reportLostFound,
  listReviews,
  submitReview,
  getLostFoundSummary,
  getAnalyticsOverview
};