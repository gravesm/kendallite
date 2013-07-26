
define(['stubit'], function(Stubit) {

    var OGP, Config, bounds;

    return describe("OgpRequest", function() {

        beforeEach(function() {

            load = Stubit(
                ['appconfig', ['solr']]
            );

            load(['solr/ogprequest', 'appconfig'], function(ogp, config) {
                OGP = ogp;
                Config = config;
            });

            bounds = jasmine.createSpyObj('bounds',
                ['toGeometry', 'getArea', 'getCenterLonLat']);
            bounds.getArea.andReturn(23);
            bounds.toGeometry.andReturn(bounds);
            bounds.getCenterLonLat.andReturn({lon: 49.96178, lat: 15.28811});

        });

        it("creates an object of search params", function() {

            Config.solr = {
                areascore: 1,
                centerscore: 2,
                intxscore: 3,
                LayerDisplayName: 4,
                Publisher: 5,
                Originator: 6,
                Abstract: 7,
                PlaceKeywords: 8
            };

            var ogp = new OGP({
                bounds: bounds,
                terms: "Rihannalicious"
            });

            spyOn(ogp, "getFilters").andReturn(['sic', 'semper', 'tyrannis']);
            spyOn(ogp, "intersection").andReturn("sure, it does");
            spyOn(ogp, "areaRelevancy").andReturn("not even close");
            spyOn(ogp, "centerRelevancy").andReturn("sometimes");

            var params = ogp.getSearchParams();

            expect(params.qf).toEqual(
                "LayerDisplayName^4 Publisher^5 Originator^6 Abstract^7 PlaceKeywords^8");
            expect(params.q).toEqual("Rihannalicious");
            expect(params.bf).toEqual([
                'not even close^1',
                'sometimes^2',
                'div($intx,$union)^3'
            ]);
            expect(params.fq).toEqual(['sic', 'semper', 'tyrannis']);
            expect(params.intx).toEqual("sure, it does");
            expect(params.union).toEqual(23);

        });

        it("creates an array of filters", function() {

            var ogp = new OGP({
                datatypes: ['frob'],
                institutions: ['frober'],
                places: ['frobest']
            });

            spyOn(ogp, "datatypeFilter").andReturn("hic");
            spyOn(ogp, "institutionFilter").andReturn("huius");
            spyOn(ogp, "placesFilter").andReturn("huic");
            spyOn(ogp, "geofilter").andReturn("hunc");

            expect(ogp.getFilters()).toEqual(['hic', 'huius', 'huic', 'hunc']);

        });

        describe("creates search components", function() {

            var ogp;

            beforeEach(function() {
                ogp = new OGP();
            });

            it("for datatype filter", function() {
                expect(ogp.datatypeFilter(['foo', 'bar', 'baz'])).toEqual(
                    "{!tag=dt}DataType:foo OR DataType:bar OR DataType:baz");
            });

            it("for institution filter", function() {
                expect(ogp.institutionFilter(['Truffletown', 'Bugwumpus'])).toEqual(
                    "{!tag=inst}Institution:Truffletown OR Institution:Bugwumpus");
            });

            it("for places filter", function() {
                expect(ogp.placesFilter(['Billingsworth Bog', 'Paddlerump'])).toEqual(
                    '{!tag=pl}PlaceKeywordsSort:"Billingsworth Bog" AND PlaceKeywordsSort:"Paddlerump"');
            });

            it("for geographic filter", function() {
                expect(ogp.geofilter()).toEqual("{!frange l=0 incl=false}$intx");
            });

            it("for intersection relevancy", function() {
                var bounds = {left: -180, bottom: -90, right: 180, top: 90};

                expect(ogp.intersection(bounds)).toEqual(
                    "product(max(0,sub(min(180,MaxX),max(-180,MinX))),max(0,sub(min(90,MaxY),max(-90,MinY))))");
            });

            it("for center relevancy", function() {
                expect(ogp.centerRelevancy(bounds)).toEqual(
                    "if(and(exists(CenterX),exists(CenterY)),recip(sqedist(CenterX,CenterY,"+
                    "49.96178,15.28811),1,1000,1000),0)");
            });

            it("for area relevancy", function() {
                expect(ogp.areaRelevancy(bounds)).toEqual(
                    "if(exists(Area),recip(abs(sub(Area,23)),1,1000,1000),0)");
            });

        });

    });

});