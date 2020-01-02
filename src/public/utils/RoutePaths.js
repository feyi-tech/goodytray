export const HOME_PATHS = [
    '/', '/index.html', '/index.js', '/index.php'
]

export const PRODUCTS_PATHS = [
    '/products'
]

export const PRODUCT_PATHS = [
    '/products/:title/:id'
]

export const PRODUCT = [
    '/products'
]

export const SEARCH_PATHS = [
    '/search/*', '/search?'
]

export const CREATE_TIPS_PATHS = [
    '/create-ad-tips'
]

export const LOGIN_PATHS = [
    '/login'
]
export const REGISTER_PATHS = [
    '/register'
]

export const GUEST_PATHS = LOGIN_PATHS.concat(REGISTER_PATHS)

export const USER_PATHS = [
    '/profile', '/settings', '/messages', '/messages/:id'/*, '/notifications'*/
]

export const APP_PATHS = HOME_PATHS.concat(PRODUCT_PATHS)
.concat(PRODUCT_PATHS)
.concat(SEARCH_PATHS)
.concat(GUEST_PATHS)
.concat(USER_PATHS)
.concat(CREATE_TIPS_PATHS)

export const SELL_PATHS = ['/sell', '/edit-ad']