const Twitter = require('twitter');

// ツイッターのキーとシークレットトークンを初期化（環境変数を使用）
const twitter = new Twitter({
    consumer_key: process.env['CONSUMER_KEY'],
    consumer_secret: process.env['CONSUMER_SECRET'],
    access_token_key: process.env['ACCESS_TOKEN_KEY'],
    access_token_secret: process.env['ACCESS_TOKEN_SECRET']
});


exports.handler = (event, context, callback) => {
    var body = event;
    //フォロー返し
    if (body.follow_events) {
        let follower = body.follow_events[0].source.id;
        let screenName = body.follow_events[0].source.screen_name;
        //フォロワーが自分自身でない場合のみフォローバック
        if (follower != process.env['MYSELF']) {
            let param = {
                user_id: follower
            };
            twitter.post('friendships/create', param, function (err, tweet, response) {
                if (err) {
                    return err;
                } else {
                    tweetRep('@' + screenName + ' さん、フォローありがとうございます！');
                }
            });
        }
    }
    // フォローありがとうございます返信リプ用の関数
    function tweetRep(arg) {
        twitter.post('statuses/update', {
            status: arg
        }, function (err, tweet, response) {
            if (err) {
                // return console.log(err);
            } else {
                // return console.log('------------返信リプ内容-------------' + JSON.stringify(tweet, undefined, "\t"));
            }
        });
    }

    //DM返信
    if (body.direct_message_events) {

        let senderId = body.direct_message_events[0].message_create.sender_id;
        console.log("senderId is " + senderId);
        let senderStr = senderId.toString();
        console.log("senderStr is " + senderStr);
        let sender = body.users[senderStr];
        console.log("sender is " + sender);
        let screenName = sender.screen_name;
        console.log("screenName is " + screenName);
        let dmText = body.direct_message_events[0].message_create.message_data.text;
        console.log("dmText is " + dmText);
        tweetRep('@' + screenName + ' さん、' + dmText);
    }
};
