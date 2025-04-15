import styles from './styles.module.css';
import { useParams, useNavigate } from "react-router-dom";

export default function UnfriendPopup({ username }) {
    const [unfriendState, setUnfriendState] = useState('default');

    const { conversation_id } = useParams();
    const navigate = useNavigate();

    async function handle_unfriend() {
        // Set popup state
        setUnfriendState('loading');
    
        // Get client auth info
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
    
        fetch(`${process.env.REACT_APP_RINGER_SERVER_URL}/remove_conversation/${conversation_id}`, {
          headers: {
            username: username,
            token: token
          },
          method: "DELETE"
        })
          .then(response => {
            if (response.ok) {
              // Make clone of friends list
              let friends_list = [...friendsListState];
    
              // Keep track of array index
              let index = 0;
    
              // Remove conversation from friends list
              friends_list.forEach((conversation) => {
                if (conversation.Id === conversation_id) {
                  friends_list.splice(index, 1);
    
                } else {
                  index += 1;
                }
              });
    
              // Update friends list
              setFriendsListState(friends_list);
    
              // Set elected conversation
              navigate('/direct_messages');
    
              setUnfriendState("completed");
            } else {
              throw new Error('Request failed with status code: ' + response.status);
            }
          })
          .catch(error => {
            // Handle any errors
            console.error(error);
          });
    }

    return (
        <div className={styles.unfriendPopup}>
            <p>Are your sure you want to unfriend <b>{username}</b>? You will no longer be able to send or receive messages from this person.</p>
            <div className={styles.buttonContainer}>
                <button style={{backgroundColor: "red"}} onClick={() => console.log('Unfriend')}>Yes, Do it!</button>
                <button onClick={() => console.log('Cancel')}>No, Don't!</button>
            </div>
        </div>
    )
}