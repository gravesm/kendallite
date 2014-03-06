define(['models/query'], function(query) {

    return describe("Query", function() {

        beforeEach(function() {
            query.clear({silent: true});
        });

        describe("initialize", function() {
            it("stores query start values as integers", function() {
                query.set("qs", "1");
                expect(typeof query.get("qs")).toBe("number");
            });

            it("stores geofilter values as booleans", function() {
                query.set("geofilter", "false");
                expect(typeof query.get("geofilter")).toBe("boolean");
            });

            it("stores restricted values as booleans", function() {
                query.set("restricted", "false");
                expect(typeof query.get("restricted")).toBe("boolean");
            });
        });

        describe("_toInt", function() {
            it("casts one element arrays to integers", function() {
                expect(typeof query._toInt(['23'])).toBe("number");
            });

            it("casts string values to integers", function() {
                expect(typeof query._toInt('23')).toBe("number");
            });
        });

        describe("_toBool", function() {
            it("casts one element arrays to booleans", function() {
                expect(typeof query._toBool(['false'])).toBe("boolean");
            });

            it("casts string values to booleans", function() {
                expect(typeof query._toBool('false')).toBe("boolean");
            });
        });

        describe("_toBounds", function() {
            it("converts a comma-separated list of values to bounds", function() {
                var bounds = query._toBounds(["1,2,3,4"]);
                expect(bounds.left).toBe(1);
                expect(bounds.bottom).toBe(2);
                expect(bounds.right).toBe(3);
                expect(bounds.top).toBe(4);
            });
            it("returns global extent as default", function() {
                var bounds = query._toBounds();
                expect(bounds.left).toBe(-180);
                expect(bounds.bottom).toBe(-90);
                expect(bounds.right).toBe(180);
                expect(bounds.top).toBe(90);
            });
        });

        describe("intersection", function() {
            it("creates intersection query from bounds", function() {
                var bounds = new OpenLayers.Bounds([1,2,3,4]);
                expect(query.intersection(bounds)).toBe(
                    "product(max(0,sub(min(3,MaxX),max(1,MinX))),max(0,sub(min(4,MaxY),max(2,MinY))))"
                );
            });
        });

        describe("centerRelevancy", function() {
            it("creates center relevancy query from bounds", function() {
                var bounds = new OpenLayers.Bounds([0,0,40,20]);
                expect(query.centerRelevancy(bounds)).toBe(
                    "if(and(exists(CenterX),exists(CenterY)),recip(sqedist(CenterX,CenterY,20,10),1,1000,1000),0)"
                );
            });
        });

        describe("areaRelevancy", function() {
            it("creates area relevancy query from bounds", function() {
                var bounds = new OpenLayers.Bounds([-10,-10,10,10]);
                expect(query.areaRelevancy(bounds)).toBe(
                    "if(exists(Area),recip(abs(sub(Area,400)),1,100,100),0)"
                );
            });
        });

        describe("dataTypeFilter", function() {
            it("creates datatype filter", function() {
                expect(query.dataTypeFilter(['Bow', 'Bear', 'Bow Bear'])).toBe(
                    '{!tag=dt}DataTypeSort:("Bow" OR "Bear" OR "Bow Bear")'
                );
                expect(query.dataTypeFilter('Bow Bear')).toBe(
                    '{!tag=dt}DataTypeSort:("Bow Bear")'
                );
            });

            it("returns undefined for no arguments", function() {
                expect(typeof query.dataTypeFilter()).toBe("undefined");
            });
        });

        describe("institutionFilter", function() {
            it("creates institution filter", function() {
                expect(query.institutionFilter(['Lord', 'Snuffle', 'Pants'])).toBe(
                    '{!tag=inst}InstitutionSort:("Lord" OR "Snuffle" OR "Pants")'
                );
                expect(query.institutionFilter("Lord Snufflepants")).toBe(
                    '{!tag=inst}InstitutionSort:("Lord Snufflepants")'
                );
            });

            it("returns undefined for no arguments", function() {
                expect(typeof query.institutionFilter()).toBe("undefined");
            });
        });

        describe("placeKeywordFilter", function() {
            it("creates place keywords filter", function() {
                expect(query.placeKeywordFilter(['Lady', 'Muffin', 'Cup'])).toBe(
                    '{!tag=pl}PlaceKeywordsSort:("Lady" AND "Muffin" AND "Cup")'
                );
                expect(query.placeKeywordFilter("Lady Muffincup")).toBe(
                    '{!tag=pl}PlaceKeywordsSort:("Lady Muffincup")'
                );
            });

            it("returns undefined for no arguments", function() {
                expect(typeof query.placeKeywordFilter()).toBe("undefined");
            });
        });

        describe("dateFilter", function() {
            it("creates date filter", function() {
                expect(query.dateFilter([
                    "1900-01-01T01:01:01Z", "2000-01-01T01:01:01Z"])
                ).toBe(
                    '{!tag=df}ContentDate:([1900-01-01T01:01:01Z TO 1900-01-01T01:01:01Z+10YEAR-1SECOND] OR [2000-01-01T01:01:01Z TO 2000-01-01T01:01:01Z+10YEAR-1SECOND])'
                );

                expect(query.dateFilter("1900-01-01T01:01:01Z")).toBe(
                    '{!tag=df}ContentDate:([1900-01-01T01:01:01Z TO 1900-01-01T01:01:01Z+10YEAR-1SECOND])'
                );
            });

            it("returns undefined for no arguments", function() {
                expect(typeof query.dateFilter()).toBe("undefined");
            });
        });

        describe("queryFields", function() {
            it("creates query fields parameter with boosts", function() {
                expect(query.queryFields({name: 2, place_keywords: 3})).toBe(
                    "LayerDisplayName^2 PlaceKeywords^3"
                );
            });
            it("filters out fields with falsy boost value", function() {
                expect(query.queryFields({name: 1, publisher: 0})).toBe(
                    "LayerDisplayName^1"
                );
            });
        });

        describe("boostFunctions", function() {

            var b = new OpenLayers.Bounds(1,2,3,4);

            beforeEach(function() {
                spyOn(query, "areaRelevancy").andReturn("23");
                spyOn(query, "centerRelevancy").andReturn("Whomplegrip");
            });

            it("returns an array of boost functions", function() {
                expect(query.boostFunctions({area: 1}, b)).toContain("23^1");
                expect(query.areaRelevancy).toHaveBeenCalledWith(b);
                expect(query.boostFunctions({center: 2}, b)).toContain("Whomplegrip^2");
                expect(query.centerRelevancy).toHaveBeenCalledWith(b);
                expect(query.boostFunctions({intx: 3}, b)).toContain("div($intx,$union)^3");
            });

            it("filters out components with falsy boost value", function() {
                var bf = query.boostFunctions({area: 0, intx: 1});
                expect(bf).not.toContain("23^1");
                expect(bf).not.toContain("Whomplegrip^2");
            });
        });

        describe("union", function() {
            it("creates union query parameter from bounds", function() {
                var b = new OpenLayers.Bounds(-10,-10,10,10);

                expect(query.union(b)).toBe("sub(sum(400,Area),$intx)");
            });
        });

        describe("restrictedFilter", function() {
            it("creates restricted filter", function() {
                expect(query.restrictedFilter(true)).toBe(
                    '!(Access:"Restricted" AND !(InstitutionSort:"MIT"))'
                );
            });
        });

        describe("spatialFilter", function() {
            it("creates spatial filter", function() {
                expect(query.spatialFilter(true)).toBe(
                    '{!frange l=0 incl=false}$intx'
                );
            });
        });

    });

});