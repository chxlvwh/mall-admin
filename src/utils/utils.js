import { DATE_TIME_FORMAT } from '@/constants/consts';
import moment from 'moment';

export function getDateTime(date) {
    return moment(date).format(DATE_TIME_FORMAT);
}
