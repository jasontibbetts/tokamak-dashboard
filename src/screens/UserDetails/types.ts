export type UserReference = {
    rel: 'User'
    ref: string
    href: string
    username: string
}
export type GroupReference = {
    rel: 'Group',
    ref: string,
    href?: string
}
export type UserRecord = {
    id: string
    modelType: 'User'
    username: string
    group: GroupReference
    createdAt?: number
    updatedAt?: number
    createdBy?: Omit<UserReference, 'username'>
    updatedBy?: Omit<UserReference, 'username'>
    password?: string
}