import axios from './axios'

export const getServiceRecords = (equipmentId: number) =>
  axios.get(`/equipment/${equipmentId}/service-records`)

export const createServiceRecord = (equipmentId: number, data: any) =>
  axios.post(`/equipment/${equipmentId}/service-records`, data)

export const deleteServiceRecord = (equipmentId: number, id: number) =>
  axios.delete(`/equipment/${equipmentId}/service-records/${id}`)