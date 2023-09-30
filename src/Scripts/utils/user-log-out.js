import Cookies from "js-cookie";

export async function log_out() {
    Cookies.remove('Username');
    Cookies.remove('Token');

    return "OK";
}