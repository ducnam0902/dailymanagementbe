import * as moment from 'moment';
import 'moment-timezone';
const getDateInCurrentTimezone = (date?: any, format?: string) => {
  return moment(date ?? new Date())
    .tz('Asia/Saigon')
    .format(format ?? 'DD-MMM-YYYY');
};

export default getDateInCurrentTimezone;
