define(['solr/ogprequest'], function(OGP) {

    var bounds, ogp;

    return describe("OgpRequest", function() {

        beforeEach(function() {

            ogp = new OGP();
            ogp.options = {};
            ogp.options.boosts = {};

            bounds = jasmine.createSpyObj('bounds',
                ['toGeometry', 'getArea', 'getCenterLonLat']);
            bounds.getArea.andReturn(23);
            bounds.toGeometry.andReturn(bounds);
            bounds.getCenterLonLat.andReturn({lon: 49.96178, lat: 15.28811});

            ogp.options.bounds = bounds;

        });

        it("sets the query fields parameter", function() {
            ogp.options.boosts.name = 70;
            ogp.options.boosts.publisher = 71;
            ogp.options.boosts.originator = 72;
            ogp.options.boosts.place_keywords = 74;

            expect(ogp.getSearchParams().qf).toEqual(
                "LayerDisplayName^70 Publisher^71 Originator^72 PlaceKeywords^74");
        });

        it("sets the query parameter", function() {
            ogp.options.terms = "Whippleburr";
            expect(ogp.getSearchParams().q).toEqual("Whippleburr");
        });

        it("sets the boost function parameter", function() {
            spyOn(ogp, "areaRelevancy").andReturn("BubbleCrumb");
            spyOn(ogp, "centerRelevancy").andReturn("BibbleTumb");
            ogp.options.boosts.area = 10;
            ogp.options.boosts.center = 15;
            ogp.options.boosts.intx = 20;

            expect(ogp.getSearchParams().bf).toEqual([
                'BubbleCrumb^10', 'BibbleTumb^15', 'div($intx,$union)^20'
            ]);
        });

        it("sets the filter query parameter", function() {
            spyOn(ogp, "getFilters").andReturn(['sic', 'semper', 'tyrannis']);
            expect(ogp.getSearchParams().fq).toEqual(['sic', 'semper', 'tyrannis']);
        });

        it("sets the intersection parameter", function() {
            spyOn(ogp, "intersection").andReturn("Thumblestuff");
            expect(ogp.getSearchParams().intx).toEqual("Thumblestuff");
        });

        it("sets the union parameter", function() {
            expect(ogp.getSearchParams().union).toEqual(23);
        });

        it("creates an array of filters", function() {

            var ogp = new OGP({
                datatypes: ['frob'],
                institutions: ['frober'],
                places: ['frobest'],
                geofilter: true
            });

            spyOn(ogp, "datatypeFilter").andReturn("hic");
            spyOn(ogp, "institutionFilter").andReturn("huius");
            spyOn(ogp, "placesFilter").andReturn("huic");
            spyOn(ogp, "geofilter").andReturn("hunc");

            expect(ogp.getFilters()).toEqual(['hic', 'huius', 'huic', 'hunc']);

        });

        it("does not add filters when not provided", function() {
            var ogp = new OGP();
            expect(ogp.getFilters()).toEqual([]);
        });

        describe("creates search components", function() {

            var ogp;

            beforeEach(function() {
                ogp = new OGP();
            });

            it("for datatype filter", function() {
                expect(ogp.datatypeFilter(['foo', 'bar', 'baz'])).toEqual(
                    '{!tag=dt}DataTypeSort:("foo" OR "bar" OR "baz")');
            });

            it("for institution filter", function() {
                expect(ogp.institutionFilter(['Truffletown', 'Bugwumpus'])).toEqual(
                    '{!tag=inst}InstitutionSort:("Truffletown" OR "Bugwumpus")');
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