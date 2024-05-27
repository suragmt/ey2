export function getAuthToken(){
    return localStorage.getItem('authtoken')
}

export function getRefreshToken(){
    return localStorage.getItem('refreshtoken')
}