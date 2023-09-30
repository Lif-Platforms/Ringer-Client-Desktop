import Cookies from "js-cookie";

export async function log_out() {
    Cookies.remove('Username', { path: '' });
    Cookies.remove('Token', { path: '' });

    return "OK";
}