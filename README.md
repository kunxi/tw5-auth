#tw5-auth

A simple authentication and authorization proxy for TiddlyWiki5.

## Quick Start

Assume you are using Google App with example.com.

Clone the source code:

    git clone https://github.com/kunxi/tw5-auth.git

Copy the config.json.example to config.json and tailor it for your use:

- get the client\_id and client\_secret from [Google API console](http://code.google.com/api/console)
- create a secret session key, my favorite tools is WordPress
- set the _domain_ to your Google App domain, example.com; logins from example.com will be granted full privilege.
- _mount_point_ is used for the Google OAuth callback: $mount_point/auth/google/callback.
Theoretically, tw5-auth can be deployed in non-root path, but it is NOT tested.
- _tw5_host_(default is localhost) and _tw_port_ specify the endpoint of TiddlyWiki5 instance
- _host_(default is localhost) and _port_ specify the tw5-auth endpoint

Run the tw5-auth service

    node tw5-auth/app.js --config config.json

Assumes tw5-auth runs in localhost:8086, and TW5 runs in localhost:8080, direct your browser
to localhost:8086, you should see the TW5 page. Try to create/modify the tiddlers, and refresh
the page, nothing is persisted.

Direct your browser to http://localhost:8086/auth/google, the page will be directed to Google
login page, login with your credential, and the page will be refreshed to the original page.
Now try to create/modify the tiddlers, and refresh the page, the tiddlers are updated.

## Advanced Usage

tw5-auth leverage the versatile [passportjs](http://www.passportjs.org) for authentication.
Please consult passportjs's [documentation](http://www.passportjs.org/guide) for more details.

If you want more sophisticated access control, you might consider
[connect-roles](https://github.com/ForbesLindesay/connect-roles).

## License
MIT
