import { useNavigate } from "react-router-dom";
import { log_out } from "src/Scripts/utils/user-log-out";

export default function AccountPanel({ accountPanelShow }) {
    function handle_account_manage() {
        window.electronAPI.openURL('https://my.lifplatforms.com');
    }

    const navigate = useNavigate();

    async function handle_log_out() {
        const status = await log_out();
    
        if (status === "OK") {
          navigate("/login");
        }
      }

    if (accountPanelShow) {
        return (
            <div className='account-panel'>
                <div className='banner' style={{ backgroundImage: `url("${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_banner/${window.localStorage.getItem('username')}.png")` }}>
                    <img className="avatar" src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/profile/get_avatar/${window.localStorage.getItem('username')}.png`} />
                </div>
                <h1>{window.localStorage.getItem('username')}</h1>
                <div className="button-container">
                    <button onClick={handle_account_manage}>Manage Account</button>
                    <button onClick={handle_log_out}>Log Out</button>
                </div>
            </div>
        );
    }
}
    