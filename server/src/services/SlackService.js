import { SLACK_NOTIFY } from '../config';
import Slack from 'slack-node';

const slack = new Slack();
slack.setWebhook(SLACK_NOTIFY.webhook);

class SlackService {

    static notifyNewUser(user) {
        if (!user) {
            return;
        }
        slack.webhook({
            channel: "#airpush",
            username: "webhookbot",
            text: `New user: ${user.name} - ${user.email}`
        }, (err, response) => {
            // console.log(response);
        });        
    }
}

export default SlackService;
