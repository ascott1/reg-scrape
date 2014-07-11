reg-scrape
==========

A command line tool written in [node.js](http://nodejs.org/) to scrape the US Code of Federal Regulations.

The original implementation was written on a short Amtrak ride.

## How

```
npm install -g reg-scrape
cd path/to/where/files/should/go
reg-scrape
```

You can also pass an optional argument to scrape the regulations from a certain year (1996-present): `reg-scrape 1999`.