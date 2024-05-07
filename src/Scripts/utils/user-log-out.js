export async function log_out() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');

    return "OK";
}