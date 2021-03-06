var fs = require('fs');
var osmium = require('osmium');
var argv = require('optimist').argv;
var _ = require('underscore');
var osmfile = argv.osmfile;
var timestamp = argv.timestamp;

var obj = function() {
        return {
                osm_node_v1: 0,
                osm_node_vx: 0,
                osm_way1: 0,
                osm_wayx: 0,
                osm_relation1: 0,
                osm_relationx: 0
        };
};

var counter = new obj();

//var file = new osmium.File(osmfile);
var reader = new osmium.Reader(osmfile);
var handler = new osmium.Handler();

handler.on('node', function(node) {
        if (node.timestamp_seconds_since_epoch >= timestamp && (node.tags().amenity !== undefined || node.tags().leisure !== undefined || node.tags().shop !== undefined)) {
                if (node.version === 1) {
                        counter.osm_node_v1++;
                } else {
                        counter.osm_node_vx++;
                }
        }
});

handler.on('way', function(way) {
        if (way.timestamp_seconds_since_epoch >= timestamp && (way.tags().highway !== undefined || way.tags().building !== undefined)) {
                if (way.version === 1) {
                        counter.osm_way1++;
                } else {
                        counter.osm_wayx++;
                }
        }
});
handler.on('relation', function(relation) {
        if (relation.timestamp_seconds_since_epoch >= timestamp && (relation.tags().highway !== undefined || relation.tags().building !== undefined)) {
                if (relation.version === 1) {
                        counter.osm_relation1++;
                } else {
                        counter.osm_relationx++;
                }
        }
});

osmium.apply(reader, handler);
var outputFilename = osmfile.split('.')[0] + '.md';

var header = 'Year |node v1 | node vx | way v1 | way vx | relation v1 | relation vx \n ---|---|---|---|---|---|---| \n';
var text = '**20XX**|' + fm(counter.osm_node_v1) + '|' + fm(counter.osm_node_vx) + '|' + fm(counter.osm_way1) + '|' + fm(counter.osm_wayx) + '|' + fm(counter.osm_relation1) + '|' + fm(counter.osm_relationx);
fs.writeFile(outputFilename, header + text, function(err) {
        if (err) {
                console.log(err);
        }
});

function fm(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}