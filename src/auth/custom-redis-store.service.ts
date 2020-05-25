import { Injectable, Logger } from '@nestjs/common';
import { BaseMemoryStore, Store } from 'express-session';
import { Express, Request } from 'express';
import * as IORedis from 'ioredis';

@Injectable()
export class CustomRedisStore extends Store implements BaseMemoryStore {
    private SESSION_PREFIX = 'userSession';
    private USER_ID_SESSION_PREFIX = 'userIdSession';
    private store = new IORedis({ host: 'redis' });
    // for subscribe to events - create separate redis instance
    private subscriber = new IORedis({ host: 'redis' });
    // token lifetime in seconds
    private TTL = 120;

    constructor() {
        super();

        this.subscribeOnExpiredEvents();
    }

    private subscribeOnExpiredEvents() {
        this.subscriber.config('SET', 'notify-keyspace-events', 'Ex');
        // subscribe to event when key is expired
        this.subscriber.psubscribe('__keyevent@*__:expired');
        this.subscriber.on('pmessage', async (channel, message, key) => {
            const [, sid] = key.split(':');
            Logger.log(`Receive message ${message} from channel ${message}`);
            const userId = await this.store.get(this.associateSidUserKey(sid));
            this.store.del(this.associateSidUserKey(sid));
            Logger.log(`user ${userId} session is expired. You can fire event to ws.`);
        });
    }

    public get = (sid: string, callback: (err: any, session?: Express.SessionData | null) => void) => {
        this.store.get(this.sessionKeyName(sid))
            .then(session => callback(null, JSON.parse(session)))
            .catch(error => callback(error));
    };

    public set = (sid: string, session: Express.Session, callback?: (err?: any) => void) => {
        const val = JSON.stringify(session);
        this.store.set(this.sessionKeyName(sid), val, 'ex', this.TTL)
            .then(() => callback(null))
            .then(() => {
                const { passport } = session;
                const { user } = passport;
                this.store.set(this.associateSidUserKey(sid), user.userId);
            })
            .catch(error => callback(error));
    };

    public destroy = (sid: string, callback?: (err?: any) => void) => {
        this.store
            .multi()
            .del(this.associateSidUserKey(sid))
            .del(this.sessionKeyName(sid))
            .exec()
            .then(() => callback(null))
            .catch(error => callback(error));
    };

    public all = (callback: (err: any, obj?: { [sid: string]: Express.SessionData; } | null) => void) => {
        this.userSessionKeys()
            .then(keys => {
                const sessions = keys.reduce((accumulate, key) => {
                    return { ...accumulate, [key]: this.store.get(key) }
                }, {});
                callback(null, sessions);
            })
            .catch(error => callback(error))
    };

    public length = (callback: (err: any, length?: number | null) => void) => {
        this.userSessionKeys()
            .then(keys => callback(null, keys.length))
            .catch(error => callback(error));
    };

    public clear = (callback?: (err?: any) => void) => {
        this.userSessionKeys()
            .then(async (keys) => {
                const associatedSessionsUserId = keys.map(key => {
                    const [, sid] = key.split(':');
                    return ['del', this.associateSidUserKey(sid)];
                });
                const sessions = keys.map(key => (['del', key]));
                this.store
                    .multi([
                        ...associatedSessionsUserId,
                        ...sessions,
                    ]);
            })
            .catch(error => callback(error));
    };

    public touch = (sid: string, session: Express.SessionData, callback?: (err?: any) => void) => {
        const ttl = this.getTTL(session);
        this.store.expire(this.sessionKeyName(sid), ttl)
            .then(() => callback(null))
            .catch(error => callback(error));
    };

    private getTTL(sess) {
        if (sess && sess.cookie && sess.cookie.expires) {
            const ms = Number(new Date(sess.cookie.expires)) - Date.now();
            return Math.ceil(ms / 1000);
        }

        return this.TTL;
    }

    private userSessionKeys(): Promise<string[]> {
        return new Promise(((resolve, reject) => {
            let keys = [];
            const stream = this.store.scanStream({
                match: `${this.SESSION_PREFIX}:*`,
            });
            stream.on('data', resultKeys => {
                keys = [ ...keys, resultKeys ];
            });
            stream.on('error', error => reject(error));
            stream.on('end', () => resolve(keys));
        }))
    }

    private sessionKeyName(identifier): string {
        return `${this.SESSION_PREFIX}:${identifier}`;
    }

    private associateSidUserKey(sid: string): string {
        return `${this.USER_ID_SESSION_PREFIX}:${sid}`;
    }
}
