from pytrends.request import TrendReq

# Login to Google. Only need to run this once, the rest of requests will use the same session.
pytrend = TrendReq()

# Interest Over Time
interest_over_time_df = pytrend.trending_searches(pn='united_states')
print(interest_over_time_df)