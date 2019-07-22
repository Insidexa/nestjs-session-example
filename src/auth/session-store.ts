import { Injectable } from '@nestjs/common';
import { BaseMemoryStore, MemoryStore } from 'express-session';
import { Express } from 'express';

@Injectable()
export class SessionStore extends MemoryStore implements BaseMemoryStore {
    private sessions: { [sid: string]: Express.SessionData; } = {};

    public get = (sid: string, callback: (err: any, session?: Express.SessionData | null) => void) => {
        callback(null, this.sessions[sid]);
    }

    public set = (sid: string, session: Express.Session, callback?: (err?: any) => void) => {
        this.sessions[sid] = session;
        callback();
    }

    public destroy = (sid: string, callback?: (err?: any) => void) => {
        this.sessions[sid] = undefined;
        callback();
    }

    public all = (callback: (err: any, obj?: { [sid: string]: Express.SessionData; } | null) => void) => {
        callback(null, this.sessions);
    }

    public length = (callback: (err: any, length?: number | null) => void) => {
        callback(null, Object.keys(this.sessions).length);
    }

    public clear = (callback?: (err?: any) => void) => {
        this.sessions = {};
        callback();
    }

    public touch = (sid: string, session: Express.SessionData, callback?: (err?: any) => void) => {
        const currentSession = this.checkExpires(sid);

        if (currentSession) {
            // update expiration
            currentSession.cookie = session.cookie;
            this.sessions[sid] = currentSession;
        }

        callback();
    }

    private checkExpires(sid: string) {
        const session = this.sessions[sid];

        if (session === undefined) {
            return;
        }

        if (session.cookie) {
            const expires = typeof session.cookie.expires === 'string'
                ? new Date(session.cookie.expires)
                : session.cookie.expires;

            // destroy expired session
            if (expires && expires <= Date.now()) {
                delete this.sessions[sid];
                return;
            }
        }

        return session;
    }
}
