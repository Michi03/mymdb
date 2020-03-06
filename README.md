## Hi and thank you for using the Mymdb Web-Extension!
If you haven't already, check out https://mymdb.org for some user friendly information about the **MyMDB Plugin**. For example, how to install it, and synchronize you ratings. If you want to contribute to this project, you can for example check out current [issues](https://github.com/Michi03/mymdb/issues) or create a [PR](https://github.com/Michi03/mymdb/pulls). In this case, briefly state what you changed and why and I'll have a look at it as soon, as I can. Thank you, and have fun :) Below is a more technical description of the plugin's general functionality. 

## Installation (Firefox)
The easiest way to install the Addon is to [click here](https://github.com/Michi03/mymdb/releases/download/1.7.0/mymdb-1.7.0-an+fx.xpi) which will download the current version of the Addon and Firefox will probably tell you that it blocked *Github's* attempt to ask you whether you want to install an Addon.
In that case just tell Firefox that it should play nice and grant the Addon permission to *access your IMDB data*.
If this should not work, follow these steps:
1. You'll have to download the plugin somehow (for example by using another browser to open [the link](https://github.com/Michi03/mymdb/releases/download/1.7.0/mymdb-1.7.0-an+fx.xpi))
2. If you managed that, open [about:addons](about:addons), which is the settings page for addons in Firefox
3. Go to the Extensions tab on the left
4. At the top there is a little cog symbol, click on it and then on *Install Add-On from file*
5. Now navigate to the directory where you have the `mymdb-1.7.0-an+fx.xpi` file and select it
6. Accept that the Addon can access your IMDB data

### Compatibility
In theory, this plugin could also work on Chromium and other browsers based on it (e.g., Chrome) but I just haven't looked into how to make a Chromium extension yet, because I mostly use Firefox myself. The plugin should also work on your smartphone, if you have Firefox installed on it (at least it does on mine). In case, you run into any trouble installing or using the plugin, feel free to drop me a mail under [info@mymdb.org](mailto:info@mymdb.org).

## Synchronization
Whenever you visit the IMDB page of a movie, the Addon checks whether you rated it, compares this rating to the data it has stored (only locally on your PC, no external database is involved), and updates its rating accordingly.
![IMDb Star Rating](https://mymdb.org/imgs/rating.png)

For this it checks the star rating from the header bar on the movie page you are currently looking at. This means, that if you go further down on the page and rate a movie in the *more like this* section, the plugin won't know and not update the rating for this movie.
![IMDb More Like This Section](https://mymdb.org/imgs/more-like-this.png)

### First Method
If you already have a large number of movie ratings, you probably do not want to visit each of the respective IMDB pages. Instead the Addon provides two simple synchronization methods:
1. Log in to IMDB and go to your [rated movies](https://www.imdb.com/list/ratings)
2. On the top right of the list with rated movies there are three dots, click on them and then on **Sync Mymdb**
3. The plugin should then be synchronizing your rated movies automatically, and tell you when it's done

### Second Method
Depending on your browser configurations this may not work. This is because, this method sends a message to IMDb, requesting a list with all your rated movies. Because, IMDb however only responds if it known the request came from you, the sent request has to include the [session cookie](https://allaboutcookies.org/cookies/session-cookies-used-for.html). This cookie authenticates you and IMDb knowns it is okay to send this highly classified data back. I haven't quite figured out which setting it is that causes this, but when I for example try to use the button, the cookie isn't sent along, and thus, I only get a **request refused** back as an answer. So, if you press the **Sync Mymdb** button and nothing happens for a while, try method nubmero duo.

1. Log in to IMDB and go to your [rated movies](https://www.imdb.com/list/ratings)
2. Instead of the **Snyc Mymdb** button, click on **Export**
3. Save the *ratings.csv* file on your computer
4. Now go to your [Addon settings](about:addons) and find the Mymdb addon
5. Go to its settings and click on the button labeled **Browse**
6. Select the *ratings.csv* file and click on **Save**
7. Wait for the synchronization to be **done**

### How it works
The [parsing](https://en.wikipedia.org/wiki/Parsing) works the same whether you use method 1, or method 2, only that in method one using the **Sync Mymdb** button, your IMDb Username is stored along with your movie ratings, so when you visit [your MyMDB user page](https://www.imdb.com/mymdb) it displays your username. Hooray!
Further details about the parsing aren't terribly interessting I think, only that at times the [character encoding](https://en.wikipedia.org/wiki/UTF-8) can mess up and you'll get a director twice... Uh, actually also, the *ratings.csv* file is the thing the plugin basically gets all the information about your movie ratings from, and it only lists directors. Thus, my plans to extent the plugin to also show actors, and screen writers requires some reworking of the synchronization process.

## User Page
I also added [this](https://www.imdb.com/mymdb) very simplistic user page to display all your rated movies sorted by director. This will definitively get improved in the future. Right now, you can use the stars to filter movies by rating, and use the text box to filter by director name. You can also combine these two filters. Use the **Reset** button or refresh the page to remove these filters again. Not much else going on there, yet. Feel free to contact me with ideas what to add :)
To get to this page just click on the little **MyMDb** tag in the IMDb Header.
![MyMDb Header Link](https://mymdb.org/imgs/user-page-link.png)

***Note*** that in order for you to see anything but a 404 page, you first have to install the plugin.

### Notice the URL
What I find funny about the user page is that it actually works entirely based on [JavaScript](https://en.wikipedia.org/wiki/JavaScript). The plugin has a context script that becomes active once you visit https://imdb.com/mymdb. This script then transforms the 404 page to the user page, you see in front of you. This is actually once of the reasons, it looks rather minimalistic, because I didn't feel like putting a bunch of [HTML](https://www.w3schools.com/html/) and [CSS](https://www.w3schools.com/css/default.asp) code into this JS script.

## Accessibility
Right now, I only distribute the plugin via Gihtub. I may add it to the official [Firefox addons store](https://addons.mozilla.org/en-US/firefox/) soon, but until now I just didn't see the point in it, as I didn't feel like the plugin was really done, and still required frequent updates. The main problem with this is, that between required updates I may be too busy to take care of it, and then people would be stuck with a broken addon for a long period of time. So, we'll see. I might come around and add it to the addon store eventually, but for now you can feel very special, if you heard of it and use it ;)
