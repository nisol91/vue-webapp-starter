// a set of function to handle local storage of login status

export function isLoggedIn() {
    // return true if user is logged in
    return localStorage.getItem('isLoggedIn') == 'true';
}
export function logIn() {
    // set the local storage
    localStorage.setItem('isLoggedIn', true);

}
export function logOut() {
    // set the local storage
    localStorage.setItem('isLoggedIn', false);
}
