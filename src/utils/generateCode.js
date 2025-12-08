import { v4 as uuidv4 } from 'uuid';

export const generateProductCode = () => {
  return `PROD-${uuidv4().slice(0, 8).toUpperCase()}`;
};

export const generateTicketCode = () => {
  return `TKT-${uuidv4().slice(0, 12).toUpperCase()}`;
};