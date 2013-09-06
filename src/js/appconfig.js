
define({

    solr: {
        areascore: 1.0,
        centerscore: 1.0,
        intxscore: 1.0,
        LayerDisplayName: 1.0,
        LayerDisplayNameSynonyms: 1.0,
        Publisher: 1.0,
        Originator: 1.0,
        Abstract: 0,
        PlaceKeywords: 2.5,
        PlaceKeywordsSynonyms: 2.5,
        ThemeKeywords: 2.5,
        ThemeKeywordsSynonymsIso: 2.5,
        ThemeKeywordsSynonymsLcsh: 2.5
    },

    auth: {
        domain: "https://delisle.mit.edu",
        location: "/ogp2/login/login.html"
    },

    ogp: {
        // root: "/opengeoportal",
        root: "/mitogp",
        // solr: "http://delisle.mit.edu/solr/"
        solr: "http://localhost/solr/"
    },

    facets: {
        InstitutionSort: "Institutions",
        DataTypeSort: "Data Type",
        PlaceKeywordsSort: "Place Keywords",
        ContentDate: "Date"
    },

    results: {
        total: 0, // total number of results rendered in DOM (includes hidden results)
        windowstart: 0, // number of first visible result in results buffer
        windowsize: 0 // number of visible results
    }

});