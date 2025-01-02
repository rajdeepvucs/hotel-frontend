
import { format } from 'date-fns';
export const getLocalTime = () => {
  const now = new Date();
  return format(now, 'hh:mm a');
};

