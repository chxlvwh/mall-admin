import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from '@/constants/consts';
import dayjs from 'dayjs';

export function getDateTime(date: Date | string | undefined) {
    return dayjs(date).format(DATE_TIME_FORMAT);
}

export function getDate(date: Date | string | undefined) {
    return dayjs(date).format(DATE_FORMAT);
}

export function getTime(date: Date | string | undefined) {
    return dayjs(date).format(TIME_FORMAT);
}
