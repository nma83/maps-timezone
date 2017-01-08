# Maps-Timezone: Chrome extension

This Chrome extension uses a [maps.google.com](http://maps.google.com) URL to extract the location of the current view.
The latitude and longitude is run through [tzwhere](https://www.npmjs.com/package/tzwhere) running on a web server.
The timezone information returned is then displayed in the popup of the extension.

Sample screenshot:

![Screenshot](https://github.com/nma83/maps-timezone/raw/master/doc/screenshot.png)

## Architecture

```
   /----------------------------------------------------------------------------\
   |+-------------------------------------------------------------+ +---------+ |
   ||URL: https://www.google.co.in/maps/@15.4145997,76.4814041,6z | | Toolbar | |
   |+-------------------------------------------------------------+ +---------+ |
   |                                     \---------+---------/        /\        |
   |                                               |           +-----/  \-----+ |
   |                                               |           |              | |
   |                                 +-------------+           |   Timezone   | |
   |                                 |                         |  Local time  | |
   |                                 |                         |              | |
   |                                 |                         +-------^------+ |
   |                       +---------v--------+                        |        |
   |                       |    Web server    |                        |        |
   |                       +------------------+                +-------+------+ |
   |                       +------------------+                |  Get TZ time | |
   |                       |      tzwhere     |                +-------^------+ |
                           +---------+--------+                        |
                                     |                                 |
                                     +---------------------------------+

```
