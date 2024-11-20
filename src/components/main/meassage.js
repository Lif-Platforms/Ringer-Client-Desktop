import '../../css/main.css';
import Clock from '../../assets/home/clock_icon.png';
import GIPHY_LOGO from '../../assets/home/GIPHY_attrabution.png';

export default function Message({
    author,
    content,
    self_destruct,
    type,
    failed_to_send,
    handle_open_popup,
    gif_url,
    messages_container,
    initialLoad,
    setCheckLinkPopup,
    message_id
}) {

    // Moves the scroll position down by the hight of the image
    const handleGIFLoad = (event) => {
        const imageHeight = event.target.height;
  
        if (messages_container.current && initialLoad.current) {
          messages_container.current.scrollTop = messages_container.current.scrollTop + imageHeight;
        }
    };

    function handle_link_click(url) {
        setCheckLinkPopup(url);
      }
    
      const renderMessageContent = (message) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = message.split(urlRegex);
    
        return parts.map((part, index) => {
          if (urlRegex.test(part)) {
            // If part is a URL, wrap it in an anchor tag
            return (
              <a key={index} onClick={() => handle_link_click(part)}>
                {part}
              </a>
            );
          } else {
            // Otherwise, render plain text
            return <span key={index}>{part}</span>;
          }
        });
    };

    function handle_resend() {
        const resend_event = new CustomEvent('resend_message', {
            detail: {
                id: message_id,
                author: author,
                content: content,
                self_destruct: self_destruct
            }
        });

        document.dispatchEvent(resend_event);
    }

    return (
        <div className='message' style={{backgroundColor: failed_to_send ? "#420202" : null}}>
            <img src={`${process.env.REACT_APP_LIF_AUTH_SERVER_URL}/get_pfp/${author}.png`} alt='' onClick={() => handle_open_popup(author)} />
            <div>
                <div className="message-header">
                    <h1>{author}</h1>
                    {self_destruct && self_destruct !== "False" ? <img title="This message will self-destruct after viewing." src={Clock} className="clock" /> : null}
                </div>
                {type === "GIF" ? (
                    <>
                    <img onLoad={handleGIFLoad} className="message-gif" src={gif_url} alt={content} />
                    <img className="giphy-logo" src={GIPHY_LOGO} />
                    </>
                ) : (
                    <p>{renderMessageContent(content)}</p>
                )}
            </div>
            {failed_to_send ? (
                <>
                    <button className='resend-button' onClick={() => handle_resend()}>Try again</button>
                </>
            ) : null}
        </div>
    )
}