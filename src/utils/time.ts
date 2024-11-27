import * as moment from 'moment';
import 'moment-timezone';
const getDateInCurrentTimezone = (date?: any , format?: string) => {
    const guessTimezone = moment.tz.guess();
    return moment(date ?? new Date()).tz(guessTimezone ?? 'Asia/Saigon').format(format ?? 'DD-MMM-YYYY')
}

export default getDateInCurrentTimezone;