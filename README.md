# Hacker News Interval

Unofficial mirror of the Hacker News where you can view HN front page stories collected on an interval.


The application consists from two parts:
* AngularJS application that displays collected data
* REST API for storing and retrieval of data

The application itself doesn't collects data. The [Hackerati News Interval worker](https://github.com/kperusko/hacker-news-interval-worker) collects data from Hacker News and submits it to the Hacker News Interval REST API.


