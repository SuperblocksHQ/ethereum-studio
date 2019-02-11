import {Observable} from 'rxjs';
import { getAuthToken } from '../../services/utils/fetchJson';

export function createAuthorizedHttpObservable(url: any) {
    return Observable.create((observer: any) => {

        const controller = new AbortController();
        const signal = controller.signal;

        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            signal
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    observer.error({errorCode: response.status});
                }
            })
            .then(body => {
                observer.next(body);
                observer.complete();
            })
            .catch(err => {
                observer.error(err);
            });

        return () => controller.abort();

    });
}

