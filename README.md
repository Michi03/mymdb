## Hi and thank you for using the Mymdb Web-Extension!
I can imagine you had hoped this is just a plug-and-play kind of deal,
but sorry Mozilla made their shitty API way to complicated for that.
So instead you will have to do some setup work before you can be off to the races.

## Installation (Firefox)
The easiest way to install the Addon is to [click here](https://github.com/Michi03/mymdb/releases/download/1.6.4/mymdb-1.6.4-an+fx.xpi) which will download the current version of the Addon and Firefox will probably tell you that it blocked *Github's* attempt to ask you whether you want to install an Addon.
In that case just tell Firefox that it should play nice and grant the Addon permission to *access your IMDB data*.
If this should not work (very likely), follow these steps:
1. Open [about:addons](about:addons), which is the settings page for addons in Firefox
2. Go to the Extensions tab on the left
3. At the top there is a little cog symbol, click on it and then on *Install Add-On from file*
4. Now navigate to the directory where you have the `mymdb-1.6.4-an+fx.xpi` file and select it
5. Accept that the Addon can access your IMDB data

## Synchronization
Whenever you visit the IMDB page of a movie, the Addon checks whether you rated it, compares this rating to the data it has stored (only locally on your PC, no external database is involved), and updates its rating accordingly.
If you already have a large number of movie ratings, you probably do not want to visit each of the respective IMDB pages. Instead the Addon provides a simplistic synchronization method:
1. Log in to IMDB and go to your rated movies
2. On the top right of the list with rated movies there are three dots, click on them and then on **Export** (Ignore the **Snyc Mymdb** button, it doesn't do anything useful, yet)
3. Save the *ratings.csv* file on your computer
4. Now go to your [Addon settings](about:addons) and find the Mymdb addon
5. Go to its settings and click on the button labeled **Browse**
6. Select the *ratings.csv* file and click on **Save**
7. Wait for the synchronization to be **done**
