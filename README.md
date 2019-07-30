##Hi and thank you for using the Mymdb Web-Extension!
I can imagine you had hoped this is just a plug-and-play kind of deal,
but sorry Mozilla made their shitty API way to complicated for that.
So instead you will have to do some setup work before you can be off to the races.

##Installation (Firefox)
You should somewhere have a file called `mymdb-1.6.1-fx.xpi`.
This is in fact the Plugin, so you need to install it manually in your browser.
Open `about:addons`, which is the settings page for addons in Firefox.
Go to the Extensions tab on the left.
At the top there is a little cog symbol.
Click on it and then on *Install Add-On from file*.
Now navigate to the directory where you have the `mymdb-1.6.1-fx.xpi` file and select it.
You will then have to accept that the Add-On can access your IMDB data.

##Setup
Log in to IMDB and go to your rated movies.
On the top right of the list with rated movies there are three dots.
Click on them and then on **Export**.
Save the *ratings.csv* file on your computer.
Now go to your Add-On settings and find the Mymdb addon.
Go to its settings and click on the button labeled **browse**.
Select the *ratings.csv* file and click on **save**.
Once the list with all the **undefined** elements stops growing, you are fully synchronized!
