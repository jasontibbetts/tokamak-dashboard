import { OBJECT_TYPES } from './constants';

export type ApiObjectType = typeof OBJECT_TYPES[number];
export type UserReference = {
    rel: 'User'
    ref: string
    username?: string
}

export type GroupReference = {
    rel: 'Group'
    ref: string
}

export interface ApiObjectData {
    id: string
    modelType: ApiObjectType
    createdAt?: number
    createdBy?: UserReference
    updatedAt?: number
    updatedBy?: UserReference
}

export interface UserData extends ApiObjectData {
    modelType: 'User'
    username: string
    password?: string
    group: GroupReference
}

export interface ApplicationData extends ApiObjectData {
    modelType: 'Application'
    name: string
}

export type ApiObjectReference<T extends ApiObjectData, P extends keyof T> = {
    rel: T['modelType']
    ref: T['id']
    href?: string
} & {
        [K in P]: T[K]
    };
export type ApiObject<T extends ApiObjectData = ApiObjectData> = {
    data?: T,
    reload(): Promise<void>
    update(data: T): Promise<void>
    loading?: boolean
    error?: Error
}