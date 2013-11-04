Kendallite
==========

Kendallite is a `Tornado <http://www.tornadoweb.org/>`_ based application for searching geospatial data. This is based off of the `OpenGeoportal <https://github.com/OpenGeoportal/OGP>`_ and searches a similar Solr index as that project.

The major difference is that layers and all the functionality for previewing are displayed on a separate page. The cart has been removed and download requests are made directly to the relevant service. Authentication and authorization have been almost entirely removed, since this was designed to run in a Shibboleth environment. The application does not proxy any requests for restricted data. New features include facets and linkable searches.

Usage
-----

This is still pretty nascent and you are better off with the main OpenGeoportal code base. If you are still interested, the general process is:

1. ``pip install -r requirements.txt``
2. Modify ogp/settings.py
3. ``./server.py``
4. Go to http://localhost:8888/

Tests
-----

There are two test suites, one for the Python code base and the other for the Javascript (these mostly just test the code that generates the Solr request). If you installed dependencies from the requirements.txt file you can just run ``nosetests`` from the project root for the Python tests.

The Javascript tests require Node.js. From project root:

1. Install dependencies with ``npm install``
2. Run tests with ``grunt test``

License
-------

Copyright (c) 2013 MIT Libraries

Distributable under the terms of the MIT License.