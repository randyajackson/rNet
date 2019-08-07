from pytrends.request import TrendReq

pytrend = TrendReq()

interest_over_time_df = pytrend.trending_searches(pn='united_states')
print(interest_over_time_df)