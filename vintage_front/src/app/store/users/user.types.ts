export interface User {
    id: string
    username: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    active: boolean
    roles: string[]
    imageId: string | null
  }
  
  export interface UserState {
    users: User[]
    selectedUser: User | null
    loading: boolean
    error: string | null
  }
  
  export const initialUserState: UserState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
  }
  
  