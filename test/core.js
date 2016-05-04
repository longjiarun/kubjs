var Kub = window.Kub;
var core = Kub.core;

describe("core module:", function() {

    xdescribe("os", function(){});

    describe("core.extend()", function(){
        var target, source, source1, sourceWithProto;

        beforeEach(function(){
            target = {
                samename: "fisrtname",
                uniquename: "uniquename"
            };            
            source = {
                samename: "secondname",
                extendArr: [3, 4],
                extendObj: {
                    a: 1,
                    b: [1, 2]
                },
            };
            source1 = {
                extendName: "source1",
                extendArr: [1, 2]
            };

            function F(){
                this.instanceProperty = "instanceProperty";
            }
            F.prototype.protoProperty = "protoProperty";
            sourceWithProto = new F();
        });

        it("should support basic copy and rewrite if conflict", function(){
            var res = core.extend(target, source);
            expect(res.samename).toBe(source.samename);
            expect(res.extendArr).toBe(source.extendArr);
            expect(res.extendObj).toBe(source.extendObj);
        });

        xit("should support deep clone", function(){
            var res = core.extend(true, target, source);
            expect(res.extend).not.toBe(source.extend);
        });

        it("should have side effect with the target parameter", function(){
            var res = core.extend(target, source);
            expect(target).toBe(res);
        });

        it("does not work with prototype property, only with own perperty", function(){
            var res = core.extend(target, sourceWithProto);
            expect(res.instanceProperty).toBe(sourceWithProto.instanceProperty);
            expect(res.protoProperty).toBeUndefined();
        });
    });
});






