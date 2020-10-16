import re 
import tweepy 
from tweepy import OAuthHandler 
from textblob import TextBlob 
from Constants import TWITTER_AUTH
  
class TwitterClient(object): 
    ''' 
    Generic Twitter Class for sentiment analysis. 
    '''
    def __init__(self, params={"oauth":False}): 
        ''' 
        Class constructor or initialization method. 
        '''

        if params['oauth']:
            self.consumer_key = TWITTER_AUTH["CONSUMER_KEY"]
            self.consumer_key_secret = TWITTER_AUTH["CONSUMER_KEY_SECRET"]
            self.access_token = TWITTER_AUTH["ACCESS_TOKEN"]
            self.access_token_secret = TWITTER_AUTH["ACCESS_TOKEN_SECRET"]
            try: 
                # create OAuthHandler object 
                self.auth = OAuthHandler(self.consumer_key, self.consumer_key_secret) 
                # set access token and secret 
                self.auth.set_access_token(self.access_token, self.access_token_secret) 
                # create tweepy API object to fetch tweets 
                self.api = tweepy.API(self.auth) 
            except Exception as e: 
                print("Authentication Failed: ", e) 
  
    def clean_tweet(self, tweet): 
        ''' 
        Utility function to clean tweet text by removing links, special characters 
        using simple regex statements. 
        '''
        return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", str(tweet)).split())
  
    def get_tweet_sentiment(self, analysis): 
        ''' 
        Utility function to classify sentiment of passed tweet 
        using textblob's sentiment method 
        '''
        # create TextBlob object of passed tweet text 
        

        # set sentiment 
        # print('analysis.sentiment=', tweet)
        if analysis.sentiment.polarity > 0: 
            return 'positive'
        elif analysis.sentiment.polarity == 0: 
            return 'neutral'
        else: 
            return 'negative'
  
    def fetch_by_topic(self, query, count = 10): 
        ''' 
        Main function to fetch tweets and parse them. 
        '''
    
        # call twitter api to fetch tweets 
        return self.api.search(q = query, count = count) 
    
    def fetch_by_user(self, username, number_of_tweets = 1000): 
        ''' 
        Main function to fetch tweets and parse them. 
        '''
  
        # 200 tweets to be extracted 
        ret = []
        pages = tweepy.Cursor(self.api.user_timeline, screen_name=username, tweet_mode="extended").pages(20)
        # print(pages[0])
        for page in pages:
            print('new', page)
            for status in page:
                ret.append((str(status.created_at), status.full_text))
        print('len', len(ret))
        return ret
        


    def analyze(self, fetched, params={'analysis':'polarity'}):
        tweets = []
        index = 0
        try:
            for tweet in fetched: 
            # empty dictionary to store required params of a tweet
                analysis = TextBlob(self.clean_tweet(tweet)) 
                _tweet = {} 
    
                # saving text of tweet 
                _tweet['text'] = tweet 
                # saving sentiment of tweet 
                _tweet['sentiment'] = self.get_tweet_sentiment(analysis) 
                _tweet['polarity'] = analysis.sentiment.polarity
                tweets.append(_tweet)
                index +=1

        except tweepy.TweepError as e: 
            # print error (if any) 
            print("Error : " + str(e))

        if params['analysis'] == 'polarity':
            return [tweet['polarity'] for tweet in tweets]
        else:
            return [1 if tweet['sentiment'] == 'positive' else 0 for tweet in tweets]