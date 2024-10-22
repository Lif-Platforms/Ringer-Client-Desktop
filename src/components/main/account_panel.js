import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountPanel({ accountPanelShow }) {
    const [username, setUsername] = useState();

    // Fetch auth credentials from secure storage
    useEffect(() => {
        window.electronAPI.getAuthCredentials().then(authInfo => {
            setUsername(authInfo.username);
        });
    })

    function handle_account_manage() {
        window.electronAPI.openURL('https://my.lifplatforms.com');
    }

    const navigate = useNavigate();

    async function handle_log_out() {
        await window.electronAPI.removeAuthCredentials();
        navigate("/login");
    }

    if (accountPanelShow) {
        return (
            <div className='account-panel'>
                <div className='banner' style={{ backgroundImage: `url("${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_banner/${username}.png")` }}>
                    <img className="avatar" src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_avatar/${username}.png`} />
                </div>
                <h1>{username}</h1>
                <div className="button-container">
                    <button onClick={handle_account_manage}>Manage Account</button>
                    <button onClick={handle_log_out}>Log Out</button>
                </div>
            </div>
        );
    }
}
    