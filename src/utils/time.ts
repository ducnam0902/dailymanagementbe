import * as moment from 'moment';
import 'moment-timezone';
const getDateInCurrentTimezone = (date?: any, format?: string) => {
  return moment(date ?? new Date())
    .tz('Asia/Saigon')
    .format(format ?? 'DD-MMM-YYYY');
};

const timeZoneValue = moment.tz.names();
enum BaseTimeZone {}

const TimeZoneEnum = timeZoneValue.reduce(
  (total, currentValue) => ({ ...total, [currentValue]: currentValue }),
  BaseTimeZone,
);

export default getDateInCurrentTimezone;
export { TimeZoneEnum };
